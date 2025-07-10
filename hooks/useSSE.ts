'use client';

import { useEffect } from "react";
import { toast } from "sonner";

export function useSSE() {
  useEffect(() => {
    const evtSource = new EventSource(`https://api.buffetanalyzer.systems/notifications/stream`);

    evtSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const topic = event;


      // Extrai só a última parte do tópico (ex: 'humidityAlert')
      console.log(topic)
      const rawTopic = data.topic || "";
      const topicParts = rawTopic.split("/");
      const topicName = topicParts[topicParts.length - 1];
      console.log(topicName)

      // Mostra o toast com base no nome do evento
      if (topicName === "humidityAlert") {
        toast.info(`Humidade fora do intervalo seguro!`);
      } else if (topicName === "badFood") {
        toast.error(`A comida não está em boas condições. REMOVER!`);
      }
    };

    return () => evtSource.close();
  }, []);
}
