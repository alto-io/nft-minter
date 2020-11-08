const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const recursive = require('recursive-fs');
const basePathConverter = require('base-path-converter');
const path = require('path');
const rimraf = require('rimraf');

require('dotenv').config()

const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
const metadata_file = '../metadata/mono_metadata.json';
const temp_metadata_dir = './temp_metadata';

let images_hash, metadata_hash, contractUri_hash;

// deploy images first to get the ipfs hash
startDeploy = () => {
    const images_dir = './metadata/images';
    let imageCount = 0;

    //we gather the files from a local directory in this example, but a valid readStream is all that's needed for each file in the directory.
    recursive.readdirr(images_dir, function (err, dirs, files) {
        let data = new FormData();
        files.forEach((file) => {
            imageCount++;
            //for each file stream, we need to include the correct relative file path
            data.append(`file`, fs.createReadStream(file), {
                filepath: basePathConverter(images_dir, file)
            })
        });

        return axios.post(url,
            data,
            {
                maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large directories
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    'pinata_api_key': process.env.PINATA_API_KEY,
                    'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
                }
            }
        ).then(function (response) {
            //handle response here
            images_hash = response.data.IpfsHash;

            console.log("image count: " + imageCount);
            console.log("image hash : " + images_hash);

            deployMetadata();

        }).catch(function (error) {
            //handle error here
            console.log("Error ---");
            console.log(error);
        });
    });    
};

// deploy erc1155 formatted json data to an ipfs directory
deployMetadata = () => {
    const gateway_url = "https://gateway.pinata.cloud/ipfs/" + images_hash;
    const tokens_dir = temp_metadata_dir + '/tokens';
    let tokenCount = 0;

    // delete all files in temp_metadata_dir
    rimraf.sync(temp_metadata_dir);

    // recreate directory
    fs.mkdirSync(tokens_dir, { recursive: true });


    let jsonData = require(metadata_file).metadata;
  
    // upload each metadata to a specific json file
    jsonData.forEach( (metadata) => {
        tokenCount++;
        // replace image url with link on ipfs gateway
        metadata.image = gateway_url + "/" + metadata.image;
        // use it also as external_url
        metadata.external_url = metadata.image;

        const filename = tokens_dir +"/" + metadata.id;
        const st = JSON.stringify(metadata, null, 2);
        fs.writeFileSync(filename, st);
    });

   //we gather the files from a local directory in this example, but a valid readStream is all that's needed for each file in the directory.
    recursive.readdirr(tokens_dir, function (err, dirs, files) {
        let data = new FormData();
        files.forEach((file) => {
            //for each file stream, we need to include the correct relative file path
            data.append(`file`, fs.createReadStream(file), {
                filepath: basePathConverter(tokens_dir, file)
            })
        });

        return axios.post(url,
            data,
            {
                maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large directories
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    'pinata_api_key': process.env.PINATA_API_KEY,
                    'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
                }
            }
        ).then(function (response) {
            //handle response here
            metadata_hash = response.data.IpfsHash;

            console.log("token count: " + tokenCount);
            console.log("token hash : " + metadata_hash);

            deployContractUri();

        }).catch(function (error) {
            //handle error here
            console.log("Error ---");
            console.log(error);
        });
    }); 


}

deployContractUri = () => {
    const contractUriFile = temp_metadata_dir + '/contracturi.json';
    const gateway_url = "https://gateway.pinata.cloud/ipfs/" + images_hash;

    // read contractUri
    let contractUri = require(metadata_file).contractUri;

    // append image with gateway_url
    contractUri.image = gateway_url + "/" + contractUri.image;

    const st = JSON.stringify(contractUri, null, 2);
    fs.writeFileSync(contractUriFile, st);    

    let data = new FormData();
    data.append(`file`, fs.createReadStream(contractUriFile));


    return axios.post(url,
        data,
        {
            maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large directories
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                'pinata_api_key': process.env.PINATA_API_KEY,
                'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
            }
        }
    ).then(function (response) {
        //handle response here
        contractUri_hash = response.data.IpfsHash;

        console.log("-----Contract Uri -----");
        console.log(st);
        console.log("-----------------------")
        console.log("contract URI hash : " + contractUri_hash);

        saveConfigFile();

    }).catch(function (error) {
        //handle error here
        console.log("Error ---");
        console.log(error);        
    });    

}


saveConfigFile = () => {
    const config_file = temp_metadata_dir + "/erc1155config.json";

    const metadata_config = {
        "gatewayUrl": "https://gateway.pinata.cloud/ipfs",
        "metadataHash": metadata_hash,
        "imagesHash": images_hash,
        "contractUriHash": contractUri_hash
    }

    const st = JSON.stringify(metadata_config, null, 2);
    fs.writeFileSync(config_file, st);    
}

startDeploy();