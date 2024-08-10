const fs = require("fs");
const iconv = require("iconv-lite");

// Specify the input and output file paths
const inputFilePath = "./data/garbage.csv";
const outputFilePath = "./data/garbage-big5.csv";

// Read the file with Big5 encoding
fs.readFile(inputFilePath, (err, data) => {
  if (err) throw err;

  // Decode the Big5 encoded data
  const decodedData = iconv.decode(data, "utf-8");

  // Encode the data to UTF-8
  const encodedData = iconv.encode(decodedData, "big5");

  // Write the UTF-8 encoded data to a new file
  fs.writeFile(outputFilePath, encodedData, (err) => {
    if (err) throw err;
    console.log("File converted to big5 and saved as", outputFilePath);
  });
});
