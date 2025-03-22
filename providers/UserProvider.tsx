"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

import { UserProviderContextType, UserProviderProps } from "@/types/providers";
import { useConversationsQuery } from "@/useQuery/queries/users.queries";
import {
  AppNavConversation,
  AppNavConversationJoinedByDate,
} from "@/types/layout";
import { startOfDay } from "date-fns";
import { getCookie, setCookie } from "cookies-next/client";
import cookiesConstants from "@/constants/cookies.constants";

const UserProviderContext = createContext<UserProviderContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserProviderContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const conversationsQuery = useConversationsQuery();
  const [selectedConversation, setSelectedConversation] =
    useState<AppNavConversation | null>(null);

  const [loadingConversations, setLoadingConversations] = useState(false);
  const [conversationsOpen, setConversationsOpen] = useState(false);
  const [conversationsJoinedByDate, setConversationsJoinedByDate] =
    useState<AppNavConversationJoinedByDate>({});

  async function setSelectedConversationHandler(
    conversation: AppNavConversation
  ) {
    setLoadingConversations(true);
    setSelectedConversation(conversation);
    setCookie(cookiesConstants.selectedConversationId, conversation.id, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    setLoadingConversations(false);
  }

  useEffect(() => {
    if (
      conversationsQuery.data &&
      conversationsQuery.data.length > 0 &&
      !selectedConversation
    ) {
      const selectedConversationId = getCookie(
        cookiesConstants.selectedConversationId
      );

      if (selectedConversationId) {
        const conversation = conversationsQuery.data.find(
          (conversation) => conversation.id === selectedConversationId
        );
        if (conversation) {
          setSelectedConversation(conversation);
          return;
        }
      }
      setConversationsJoinedByDate(
        conversationsQuery.data.reduce((acc, conversation) => {
          const date = new Date(conversation.updatedAt).toDateString();
          const todaysDate = startOfDay(new Date()).getTime();
          const yesterdayDate = startOfDay(
            new Date(Date.now() - 86400000)
          ).getTime();
          if (startOfDay(conversation.updatedAt).getTime() === todaysDate) {
            acc["Hoy"] = acc["Hoy"] || [];
            acc["Hoy"].push(conversation);
            return acc;
          } else if (
            startOfDay(conversation.updatedAt).getTime() === yesterdayDate
          ) {
            acc["Ayer"] = acc["Ayer"] || [];
            acc["Ayer"].push(conversation);
            return acc;
          }
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(conversation);
          return acc;
        }, {} as AppNavConversationJoinedByDate)
      );
    }
  }, [conversationsQuery.data, selectedConversation]);

  useEffect(() => {
    setLoadingConversations(conversationsQuery.isLoading);
  }, [conversationsQuery.isLoading]);

  return (
    <UserProviderContext.Provider
      value={{
        conversations: {
          conversations: conversationsQuery.data || [],
          selectedConversation: selectedConversation,
          isLoading: loadingConversations,
          conversationsOpen: conversationsOpen,
          conversationsJoinedByDate: conversationsJoinedByDate,
          setConversationsOpen: setConversationsOpen,
          setSelectedConversation: setSelectedConversationHandler,
        },
      }}
    >
      {children}
    </UserProviderContext.Provider>
  );
};
