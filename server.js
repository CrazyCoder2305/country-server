const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");
const multer = require("multer");
const controller = require("./controller");

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// const validateImage = multer.f
app.use(multer({ storage: fileStorage }).single("flag"));

app.get("/countries", (req, res) => {
  const countryList = controller.getCountryList();
  console.log(countryList);
  const responseBody = JSON.parse(countryList).countries.map((country) => {
    return {
      id: country.id,
      name: country.name
    };
  });
  console.log("COUNTRY LIST==>", responseBody);
  res.send(responseBody);
});

app.get("/continents", (req, res) => {
  const countryList = controller.getCountryList();
  const contienentArray = JSON.parse(countryList).countries.map((country) => {
    return country.continent;
  });
  const uniqueContinent = [...new Set(contienentArray)];
  res.send(uniqueContinent);
});

app.get("/countries/:id", (req, res) => {
  const countryId = req.params.id;
  const countryList = controller.getCountryList();
  const countryDetails = JSON.parse(countryList).countries.filter((country) => {
    return country.id.toString() === countryId;
  });
  console.log("request param==>", req.params, countryDetails, countryId);
  res.send(countryDetails);
  res.end();
});

app.post("/country", function (req, res) {
  // console.log("POST request=>", req.body);
  const flag = "images/" + req.file.originalname;
  console.log("flagimg", flag);
  const countryData = req.body;
  countryData.flag = flag;
  console.log(countryData);
  controller.saveCountryData(countryData, (saved) => {
    if (saved) {
      res.status(200).send(countryData);
    } else {
      res.status(404).send("error in saving file");
    }
  });
});
app.listen(port, () => console.log(`Example app listening on port port!`));
