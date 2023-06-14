const os = require('os');
const express = require('express');
const app = express();
const redis = require('redis');
const client = redis.createClient({
  host: 'redis',
  port: 6379
});
app.use(express.json())

// Pobieranie wszystkich samochodów
app.get('/cars', function(req, res) {
    // Pobieranie wszystkich danych samochodów z Redis
    client.keys('*', (err, keys) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Wystąpił błąd podczas pobierania samochodów.');
      }
      if (!keys || keys.length === 0) {
        return res.status(404).send('Nie znaleziono żadnych samochodów.');
      }
      
      // Pobieranie danych samochodów
      client.mget(keys, (err, carsData) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Wystąpił błąd podczas pobierania samochodów.');
        }
        
        const cars = carsData.map((carData) => JSON.parse(carData));
        res.json(cars);
      });
    });
  });

// Dodawanie samochodu
app.post('/car', function(req, res) {
    
  const carId = req.body.id;
  const carData = JSON.stringify(req.body);
  
  // Zapisywanie danych o samochodzie w Redis pod kluczem będącym ID samochodu
  client.set(carId, carData, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Wystąpił błąd podczas dodawania samochodu.');
    }
    res.send('Samochód został dodany.');
  });
});

// Pobieranie samochodu po ID
app.get('/car/:id', function(req, res) {
  const carId = req.params.id;
  
  // Pobieranie danych samochodu z Redis
  client.get(carId, (err, carData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Wystąpił błąd podczas pobierania samochodu.');
    }
    if (!carData) {
      return res.status(404).send('Nie znaleziono samochodu o podanym ID.');
    }
    const car = JSON.parse(carData);
    res.json(car);
  });
});



// // Usuwanie samochodu po ID
app.delete('/car/:id', function(req, res) {
  const carId = req.params.id;
  
  // Usuwanie danych samochodu z Redis
  client.del(carId, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Wystąpił błąd podczas usuwania samochodu.');
    }
    if (result === 0) {
      return res.status(404).send('Nie znaleziono samochodu o podanym ID.');
    }
    res.send('Samochód został usunięty.');
  });
});

// // Głosowanie na samochód
app.post('/car/:id/vote', function(req, res) {
  const carId = req.params.id;
  const vote = req.body.vote;
  
  // Pobieranie danych samochodu z Redis
  client.get(carId, (err, carData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Wystąpił błąd podczas pobierania samochodu.');
    }
    if (!carData) {
      return res.status(404).send('Nie znaleziono samochodu o podanym ID.');
    }
    
    const car = JSON.parse(carData);
    car.vote = car.vote || 0;
    
    if (vote === '+') {
      car.vote++;
    } else if (vote === '-') {
      car.vote--;
    } else {
      return res.status(400).send('Nieprawidłowy głos.');
    }
    
    // Aktualizacja danych samochodu w Redis
    client.set(carId, JSON.stringify(car), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Wystąpił błąd podczas głosowania na samochód.');
      }
      res.send('Głos został zarejestrowany.');
    });
  });
});

app.listen(5000, function() {
    console.log('Web application is listening on port 5000');
});
