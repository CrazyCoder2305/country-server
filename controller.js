const fs = require("fs");
const validate = (oldJson, newObj) => {
  console.log("oldJson===>", oldJson);
  console.log("newObj====>", newObj.rank);
  const matchRank = oldJson.find(
    (item) => item.rank.toString() === newObj.rank
  );
  const matchName = oldJson.find((item) => item.name === newObj.name);
  console.log("data=====>", matchRank, matchName);
  if (!matchRank && !matchName) {
    return true;
  }
  return false;
};
const saveCountryData = (data, cb) => {
  console.log("save data");
  const CountryList = JSON.parse(getCountryList());
  const isValid = validate(CountryList.countries, data);
  if (!isValid) {
    console.log("invalid rank");
    cb(false);
  } else {
    const currentHighestIndexFinder = (currentVal, nextVal) =>
      currentVal.id > nextVal.id ? currentVal : nextVal;
    const currentHighestIndex = CountryList.countries.reduce(
      currentHighestIndexFinder
    );
    data.id = currentHighestIndex.id + 1;
    CountryList.countries.push(data);
    fs.writeFile("./data/data.json", JSON.stringify(CountryList), (err) => {
      if (err) {
        console.log("error occured when storing data");
        cb(false);
      } else {
        cb(true);
      }
    });
  }
};
const getCountryList = () => {
  return Buffer.from(fs.readFileSync("./data/data.json")).toString();
};

module.exports = {
  getCountryList: getCountryList,
  saveCountryData: saveCountryData
};
