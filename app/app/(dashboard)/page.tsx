"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { signOut, useSession } from "next-auth/react";
import debounce from "just-debounce-it";
import { SUBMIT_DEBOUNCE_MS } from "@/lib/utils";
import { useMutation } from "react-query";
import { createZodFetcher } from "zod-fetch";
import { fetcher } from "@/lib/utils";
import defaultResponseSchema from "@/schemas/defaultResponseSchema";

export default function Home() {
  const { data: session } = useSession();
  const socketUrl = "ws://localhost:7071";
  const [messageHistory, setMessageHistory] = useState([]);
  const { /*sendMessage,*/ lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: Infinity,
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  async function startSmokingSession() {
    const fetch = createZodFetcher(fetcher);
    return fetch(
      defaultResponseSchema,
      process.env.NEXT_PUBLIC_BACKEND_URL + "/api/start",
      {
        method: "POST",
        body: JSON.stringify({
          //add error handling for missing session id i guess, or just use !
          authorId: Number.parseInt(session?.user.id ?? "-1"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const {
    mutate: mutateStart,
    isLoading: isLoadingStart,
    isSuccess: isSuccessStart,
  } = useMutation({
    mutationFn: startSmokingSession,
    onError: (error) => {
      if (error instanceof Error) {
        alert(error);
      }
    },
  });

  const debounceStartSmokingSession = debounce(
    () => mutateStart(),
    SUBMIT_DEBOUNCE_MS,
    true
  );

  async function stopSmokingSession() {
    const fetch = createZodFetcher(fetcher);
    return fetch(
      defaultResponseSchema,
      process.env.NEXT_PUBLIC_BACKEND_URL + "/api/stop",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const {
    mutate: mutateStop,
    isLoading: isLoadingStop,
    isSuccess: isSuccessStop,
  } = useMutation({
    mutationFn: stopSmokingSession,
    onError: (error) => {
      if (error instanceof Error) {
        alert(error);
      }
    },
  });

  const debounceStopSmokingSession = debounce(
    () => mutateStop(),
    SUBMIT_DEBOUNCE_MS,
    true
  );

  return (
    <main>
      <div>
        <Button
          variant="default"
          onClick={() => {
            debounceStartSmokingSession();
          }}
        >
          Start
        </Button>
        <Button variant="default" onClick={() => debounceStopSmokingSession()}>
          Stop
        </Button>
        <Button variant="destructive" onClick={() => signOut()}>
          Log out
        </Button>
        <br />
        <span>The WebSocket is currently {connectionStatus}</span>
        {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
        <ul>
          {messageHistory.map((message, idx) => (
            <span key={idx}>{message ? message.data : null}</span>
          ))}
        </ul>
      </div>
    </main>
  );
}
