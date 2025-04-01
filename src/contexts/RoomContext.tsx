import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  onSnapshot,
  Timestamp,
  DocumentData,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useUser } from "./UserContext";

const isProduction = process.env.NODE_ENV === 'production';

export type Activity = {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  text: string;
  timestamp: Timestamp;
  category?: string;
};

export type Room = {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Timestamp;
  activities: Activity[];
};

interface RoomContextType {
  currentRoomId: string | null;
  createRoom: (name: string) => Promise<string>;
  joinRoom: (roomId: string) => Promise<Room | null>;
  leaveRoom: () => void;
  logActivity: (text: string, category?: string) => Promise<void>;
  currentRoom: Room | null;
  loadingRoom: boolean;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 10);

const mapDocToRoom = (docData: DocumentData, id: string): Room => {
  const activities = (docData.activities || []).map((act: any) => ({
    ...act,
    timestamp: act.timestamp instanceof Timestamp ? act.timestamp : new Timestamp(act.timestamp?.seconds || 0, act.timestamp?.nanoseconds || 0),
  }));

  return {
    id,
    name: docData.name || "",
    createdBy: docData.createdBy || "",
    createdAt: docData.createdAt instanceof Timestamp ? docData.createdAt : new Timestamp(docData.createdAt?.seconds || 0, docData.createdAt?.nanoseconds || 0),
    activities,
  };
};


export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [loadingRoom, setLoadingRoom] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomIdFromUrl = urlParams.get("room");
    if (roomIdFromUrl && !currentRoomId) {
        if (user) {
            joinRoom(roomIdFromUrl);
        } else {
            sessionStorage.setItem('pendingRoomId', roomIdFromUrl);
        }
    }
  }, [user, currentRoomId]);

  useEffect(() => {
      const pendingRoomId = sessionStorage.getItem('pendingRoomId');
      if (user && pendingRoomId) {
          joinRoom(pendingRoomId);
          sessionStorage.removeItem('pendingRoomId');
      }
  }, [user]);


  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    if (currentRoomId) {
      setLoadingRoom(true);
      const roomRef = doc(db, "rooms", currentRoomId);

      unsubscribe = onSnapshot(
        roomRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const roomData = mapDocToRoom(docSnap.data(), docSnap.id);
            setCurrentRoom(null);
            setCurrentRoom(roomData);
          } else {
            console.error("[onSnapshot] Current room document does not exist!");
            setCurrentRoom(null);
            setCurrentRoomId(null);
          }
          setLoadingRoom(false);
        },
        (error) => {
          console.error("[onSnapshot] Error listening to room document:", error);
          setLoadingRoom(false);
        }
      );
    } else {
      setCurrentRoom(null);
      setLoadingRoom(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentRoomId]);

  const createRoom = async (name: string): Promise<string> => {
    if (!user) throw new Error("User must be logged in to create a room");
    setLoadingRoom(true);

    try {
      const roomData = {
        name,
        createdBy: user.name,
        creatorId: user.id,
        createdAt: serverTimestamp(),
        activities: [],
      };

      const roomsCollectionRef = collection(db, "rooms");
      const docRef = await addDoc(roomsCollectionRef, roomData);
      const initialActivity = {
        id: generateId(),
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        text: `Created room "${name}"`,
        timestamp: Timestamp.now(),
        category: "system",
      };
      await updateDoc(docRef, {
          activities: arrayUnion(initialActivity)
      });

      setCurrentRoomId(docRef.id);

      const url = new URL(window.location.href);
      url.searchParams.set('room', docRef.id);
      window.history.pushState({}, '', url);

      return docRef.id;
    } catch (error) {
      console.error("Error creating room in Firestore:", error);
      setLoadingRoom(false);
      throw error;
    }
  };

  const joinRoom = useCallback(async (roomId: string): Promise<Room | null> => {
    if (!user) {
        if (!isProduction) console.warn("User not available yet, cannot join room.");
        sessionStorage.setItem('pendingRoomId', roomId);
        return null;
    }
    setLoadingRoom(true);

    try {
      const roomRef = doc(db, "rooms", roomId);
      const docSnap = await getDoc(roomRef);

      if (docSnap.exists()) {
        const roomData = mapDocToRoom(docSnap.data(), docSnap.id);

        const joinActivity = {
          id: generateId(),
          userId: user.id,
          userName: user.name,
          userColor: user.color,
          text: `Joined the room`,
          timestamp: Timestamp.now(),
          category: "system",
        };
        await updateDoc(roomRef, {
          activities: arrayUnion(joinActivity),
        });

        setCurrentRoomId(roomId);

        const url = new URL(window.location.href);
        url.searchParams.set('room', roomId);
        window.history.pushState({}, '', url);

        return roomData;
      } else {
        if (!isProduction) console.log("Room not found:", roomId);
        setCurrentRoomId(null);
        setCurrentRoom(null);
        setLoadingRoom(false);
        const url = new URL(window.location.href);
        url.searchParams.delete('room');
        window.history.pushState({}, '', url);
        return null;
      }
    } catch (error) {
      console.error("Error joining room:", error);
      setCurrentRoomId(null);
      setCurrentRoom(null);
      setLoadingRoom(false);
      return null;
    }
  }, [user]);

  const leaveRoom = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('room');
    window.history.pushState({}, '', url);
    setCurrentRoomId(null);
  };

  const logActivity = async (text: string, category?: string) => {
    if (!user || !currentRoomId) {
      console.warn("Cannot log activity: No user or current room.");
      return;
    }

    if (!text || typeof text !== 'string') {
      console.error("Cannot log activity: Invalid text");
      return;
    }

    const newActivity = {
      id: generateId(),
      userId: user.id,
      userName: user.name || 'Anonymous',
      userColor: user.color || '#000000',
      text: text.trim(),
      timestamp: Timestamp.now(),
      category: category || 'general',
    };

    if (Object.values(newActivity).some(val => val === undefined)) {
      console.error("Cannot log activity: Undefined values detected", newActivity);
      return;
    }

    try {
      const roomRef = doc(db, "rooms", currentRoomId);
      await updateDoc(roomRef, {
        activities: arrayUnion(newActivity),
      });
    } catch (error) {
      console.error("Error logging activity:", error, "Activity data:", newActivity);
    }
  };

  return (
    <RoomContext.Provider
      value={{
        currentRoomId,
        createRoom,
        joinRoom,
        leaveRoom,
        logActivity,
        currentRoom,
        loadingRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};
