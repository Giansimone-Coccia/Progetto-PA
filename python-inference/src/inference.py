import redis # type: ignore
import os

redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = int(os.getenv('REDIS_PORT', 6379))

r = redis.Redis(host=redis_host, port=redis_port, db=0)

# Esempio di scrittura e lettura da Redis
key = 'my_key'
value = 'Hello, Redis!'

# Scrivi un valore nella chiave 'my_key'
r.set(key, value)

# Leggi il valore dalla chiave 'my_key'
result = r.get(key)
print(f"Valore letto da Redis: {result.decode('utf-8')}")

# Ora stampiamo qualcosa su localhost
print("Stampa qualcosa su localhost!")
