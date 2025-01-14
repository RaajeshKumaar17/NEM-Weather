const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const axios=require('axios');

const PORT=process.env.PORT||3000;

const app=express();
app.use(express.static('public'));

app.set('view engine','ejs')
dotenv.config();
app.use(bodyParser.urlencoded({extended:true}));

const connectionString = "mongodb+srv://<username>:<password>@cluster0.wo8yk.mongodb.net/<yourDatabaseName>?retryWrites=true&w=majority";

mongoose.connect(connectionString)
.then(()=>{
    console.log("Data base connected succesfully");
    
}).catch((error)=>{
    console.log("Database connection failed",error);
    
});
const userPreference=require('./models/userpreference');


app.get('/',(req,res)=>{
    res.render('index')
});
app.post('/weather',async(req,res)=>{
    let city;
    const apiKey=process.env.OPENWEATHER_API_KEY;
    const currentDateTime = new Date().toLocaleString();
if(req.body.city){
        city=req.body.city;
        const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try{
    const response=await axios.get(url);
    const weatherData=response.data;
    
   

    const newUserPreference = new userPreference({
        city: weatherData.name,
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity
      });
  
      await newUserPreference.save()
      .then(() => console.log('Weather data saved successfully!'))
    
      .catch((err) => console.error('Error saving weather data:', err));
  
    res.render('weather',{weatherData,currentDateTime});
}catch(error){
    console.error(error);
    
    res.send('Error fetching weather data .please try again.')
}
}else if(req.body.lat&&req.body.lon){
    const {lat,lon}=req.body;

    if (lat < -90 || lat > 90) {
        return res.send('Invalid latitude. Latitude must be between -90 and 90.');
    }
    if (lon < -180 || lon > 180) {
        return res.send('Invalid longitude. Longitude must be between -180 and 180.');
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        const weatherData = response.data;
  
        const newUserPreference = new userPreference({
          city: weatherData.name,
          temperature: weatherData.main.temp,
          humidity: weatherData.main.humidity
        });
  
        await newUserPreference.save()
          .then(() => console.log('Weather data saved successfully!'))
          .catch((err) => console.error('Error saving weather data:', err));
  
        res.render('weather', { weatherData, currentDateTime });
      } catch (error) {
        console.error(error);
        res.send('Error fetching weather data. Please try again.');
      }
    
}else {
    res.send('City or location is required.');
  }
});

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    
})
