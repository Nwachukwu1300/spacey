import React, { createContext, useState, useContext, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Create the context
const UserContext = createContext();

// Custom hook to use the user context
export const useUserContext = () => {
  return useContext(UserContext);
};

// Provider component
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Effect to handle authentication state changes
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Load user progress and badges from Firestore
        try {
          const db = firebase.firestore();
          
          // Get user progress
          const progressSnapshot = await db.collection('userProgress')
            .doc(user.uid)
            .get();
            
          if (progressSnapshot.exists) {
            setUserProgress(progressSnapshot.data().lessons || {});
          }
          
          // Get user badges
          const badgesSnapshot = await db.collection('userBadges')
            .doc(user.uid)
            .get();
            
          if (badgesSnapshot.exists) {
            setEarnedBadges(badgesSnapshot.data().badges || []);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        // Reset state when user logs out
        setUserProgress({});
        setEarnedBadges([]);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to update user progress
  const updateUserProgress = async (lessonId, progressData) => {
    if (!currentUser) return;
    
    try {
      // Update local state
      const updatedProgress = {
        ...userProgress,
        [lessonId]: progressData
      };
      setUserProgress(updatedProgress);
      
      // Update in Firestore
      const db = firebase.firestore();
      await db.collection('userProgress')
        .doc(currentUser.uid)
        .set({
          lessons: updatedProgress
        }, { merge: true });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Function to save earned badges
  const saveEarnedBadge = async (badge) => {
    if (!currentUser) return;
    
    // Check if badge is already earned to avoid duplicates
    const badgeExists = earnedBadges.some(
      existingBadge => existingBadge.name === badge.name
    );
    
    if (badgeExists) return;
    
    try {
      // Add date earned to badge
      const badgeWithDate = {
        ...badge,
        earnedDate: new Date().toISOString()
      };
      
      // Update local state
      const updatedBadges = [...earnedBadges, badgeWithDate];
      setEarnedBadges(updatedBadges);
      
      // Update in Firestore
      const db = firebase.firestore();
      await db.collection('userBadges')
        .doc(currentUser.uid)
        .set({
          badges: updatedBadges
        }, { merge: true });
    } catch (error) {
      console.error('Error saving badge:', error);
    }
  };

  // Create a simple guest account for demo purposes
  const createGuestAccount = async () => {
    try {
      // Generate a random email and password
      const randomId = Math.random().toString(36).substring(2, 15);
      const email = `guest_${randomId}@spacey-demo.com`;
      const password = `guest${randomId}`;
      
      // Create the account
      const credential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      
      // Save the user info
      const db = firebase.firestore();
      await db.collection('users').doc(credential.user.uid).set({
        displayName: `Space Explorer ${randomId.slice(0, 4)}`,
        isGuest: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      return credential.user;
    } catch (error) {
      console.error('Error creating guest account:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userProgress,
    earnedBadges,
    updateUserProgress,
    saveEarnedBadge,
    createGuestAccount,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export default UserContext;