import inferenceQueue from '../config/bull';

inferenceQueue.process(async (job) => {
  // Logica per eseguire l'inferenza
  // Puoi chiamare qui il container Docker con il modello Python
});

export default inferenceQueue;
