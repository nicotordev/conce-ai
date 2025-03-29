"use client";

import { AuthAppIdeasProps } from "@/types/auth";
import IdeaMarkdownRenderer from "../Common/IdeaMarkdownRenderer";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthAppIdeas({ ideas }: AuthAppIdeasProps) {
  const [activeIdea, setActiveIdea] = useState<string>("");
  const [displayText, setDisplayText] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nextIdeaTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Cambia a la siguiente idea aleatoria
  const changeToNextIdea = useCallback(() => {
    if (!ideas || ideas.length === 0 || !mountedRef.current) return;

    // Limpieza de timeouts/animaciones previas
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (nextIdeaTimeoutRef.current) {
      clearTimeout(nextIdeaTimeoutRef.current);
      nextIdeaTimeoutRef.current = null;
    }

    // Restablece el texto mostrado
    setDisplayText("");

    // Obtiene un índice aleatorio diferente al actual
    const currentIdeaIndex = ideas.indexOf(activeIdea);
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * ideas.length);
    } while (nextIndex === currentIdeaIndex && ideas.length > 1);

    // Actualiza la idea activa y reinicia la animación
    const newIdea = ideas[nextIndex];
    setActiveIdea(newIdea);
    setIsTyping(true); // Reinicia la animación de escritura
    console.log("Cambiando a nueva idea:", newIdea); // Log para depuración
  }, [ideas, activeIdea]);

  // Maneja la animación de escritura
  useEffect(() => {
    if (!activeIdea || !isTyping || !mountedRef.current) return;

    let currentIndex = 0;
    const TYPING_SPEED = 50;

    const animateTyping = () => {
      if (!mountedRef.current) return;

      if (currentIndex < activeIdea.length) {
        setDisplayText(activeIdea.substring(0, currentIndex + 1));
        currentIndex++;
        typingTimeoutRef.current = setTimeout(animateTyping, TYPING_SPEED);
      } else {
        // Finalizó la animación de escritura
        setTimeout(() => {
          setActiveIdea("");
          setDisplayText("");
          setIsTyping(false);
        }, 6000);

        // Espera 5 segundos antes de cambiar de idea
        nextIdeaTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            changeToNextIdea();
          }
        }, 8000);
      }
    };

    // Inicia la animación de escritura
    typingTimeoutRef.current = setTimeout(animateTyping, TYPING_SPEED);

    // Limpieza de efectos previos
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [activeIdea, isTyping, changeToNextIdea]);

  // Inicializa con una idea aleatoria cuando el componente se monta
  useEffect(() => {
    mountedRef.current = true;

    if (ideas && ideas.length > 0) {
      const randomIndex = Math.floor(Math.random() * ideas.length);
      setActiveIdea(ideas[randomIndex]);
      setIsTyping(true); // Inicia la animación de escritura
      console.log("Idea inicial:", ideas[randomIndex]);
    }

    // Limpieza al desmontar el componente
    return () => {
      mountedRef.current = false;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (nextIdeaTimeoutRef.current) {
        clearTimeout(nextIdeaTimeoutRef.current);
      }
    };
  }, [ideas]);

  if (!ideas || ideas.length === 0) {
    return null;
  }

  return (
    <div className="px-7 py-2.5 max-w-full gap-2 bg-transparent w-full h-full flex items-center justify-start backdrop-brightness-[105%] backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={`idea-${activeIdea.substring(0, 10)}-${
            isTyping ? "typing" : "done"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="flex items-center gap-8">
            <IdeaMarkdownRenderer
              content={displayText.replace(/\n\n/g, "\n")}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
