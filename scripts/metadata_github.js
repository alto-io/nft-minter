require("dotenv").config();

const GITHUB_GIST_KEY = process.env.GITHUB_GIST_KEY
const PREDEFINED_GITHUB_GIST_ID = process.env.PREDEFINED_GITHUB_GIST_ID

const CONTRACT_IDENTIFIER = ".contracturi"; // add a . in the beginning to make it appear first on the gist list
const temp_metadata_dir = './temp_metadata';
const contracturi_file = '../metadata/contracturi.json';


const GIST_CHECKOUT_CMD = 'git clone ssh://git@gist.github.com/'
const GIST_URL_PREFIX = "http://gist.github.com/raw/"

const fs = require('fs');
const rfs = require('recursive-fs');
const shell = require('shelljs');

const { Octokit } = require("@octokit/core");

const octokit = new Octokit({ auth: GITHUB_GIST_KEY });

let contractUri = {}
let gistId;
let contractUriUrl;

const main = async () => {
  
  // if we have a predefined gist id, don't run the script
  if (PREDEFINED_GITHUB_GIST_ID)
  {
    console.log("Predefined Gist Id found: " + PREDEFINED_GITHUB_GIST_ID + " , ending script.");
  }

  else 
  {

    // upload the contract URI first so we have a gist id
    await createContractUri();
    
    console.log("Contract URI saved: " + gistId);
    contractUriUrl = GIST_URL_PREFIX + gistId;
    console.log(contractUriUrl);

    // check out the gist repository
    await checkoutGist();

    // format and copy all files into the repo
    await formatAndCopyFilesToRepo();

    // commit the source to github
    await commitGistRepo();

    // save the deploy info
    await saveConfigFile();
  }

}


saveConfigFile = () => {
    const config_file = "./src/packages/client/deployinfo.json";

    const metadata_config = {
        "gistId": gistId
    }

    const st = JSON.stringify(metadata_config, null, 2);
    fs.writeFileSync(config_file, st);    
}

const createContractUri = async () => {

  contractUri = require(contracturi_file);

  let files = {}
  files[CONTRACT_IDENTIFIER] = {
      content: JSON.stringify(contractUri, null, 2)
  }

  const response = await octokit.request("POST /gists", {
    files
  });  

  gistId = response.data.id;
}

const checkoutGist = async () => {
  shell.cd(temp_metadata_dir);
  shell.exec(GIST_CHECKOUT_CMD + gistId + ".git")
  shell.cd("..");

}

const commitGistRepo = async () => {
  shell.cd(temp_metadata_dir + "/" + gistId);
  shell.exec("git add .");
  shell.exec('git commit -m "add metadata"');
  shell.exec('git push');
}

const formatAndCopyFilesToRepo = async () => {

  const gist_dir = temp_metadata_dir + "/" + gistId;

  const definitions_dir = './metadata/definitions';
  const images_dir = "./metadata/images";


  // move definitions first
  {
    let {files} = await rfs.read(definitions_dir);

    files.forEach( async (file) => {

      // filename on gist should just be a number, remove the .json extension
      let filename = file.split("/").pop().split('.', 1)[0];
      
      // assumes the script is run from root
      let metadata = require("." + file);  

      // replace image url with link on ipfs gateway
      metadata.image = contractUriUrl + "/" + metadata.image;
      // use it also as external_url
      metadata.external_url = metadata.image;
  
      const dest_file = gist_dir +"/" + filename;
      const st = JSON.stringify(metadata, null, 2);

      fs.writeFileSync(dest_file, st);      
    })
  }

  // copy images next
  {
    let {files} = await rfs.read(images_dir);

    files.forEach( async (file) => {
      let filename = file.split("/").pop();
      fs.copyFileSync(file, gist_dir + "/" + filename);

    })
  }

}

main()

// let imageData = {}
// let gistUrl;

// const saveImageData = async () => {

//   const response = await octokit.request("POST /gists", {
//     files: imageData
//     });

// }

// const getImageData = async () => {

//   const images_dir = './metadata/images';

//   let {files} = await rfs.read(images_dir);

//   files.forEach( async (file) => {
//     let filename = file.split("/").pop();

//     const data = fs.readFileSync(file);
    
//     imageData[filename] = 
//     {
//       content: data
//     }

//   })


  // recursive.readdirr(images_dir, function (err, dirs, imageFiles) {
  //   imageFiles.forEach((file) => {
  //         imageCount++;
  //         let filename = file.split("/").pop();

  //         const data = fs.readFile(file);
  //         imageData[filename] = data.toString();

  //         console.log(data)
  //     })
  //   })


  // const content =
  // {
  //   "id": "0",
  //   "name": "Fighter Sword",
  //   "description": "For poking.",
  //   "image": "Fighter_Sword.png",
  //   "attributes": [
  //       {
  //         "trait_type": "Base", 
  //         "value": "Sword"
  //       }, 
  //       {
  //         "trait_type": "Attack", 
  //         "value": 10
  //       }, 
  //       {
  //         "trait_type": "Speed", 
  //         "value": 0.5
  //       }, 
  //       {
  //         "display_type": "boost_number", 
  //         "trait_type": "Enchantment", 
  //         "value": 40
  //       }, 
  //       {
  //         "display_type": "boost_percentage", 
  //         "trait_type": "Chance to Hit", 
  //         "value": 50
  //       }, 
  //       {
  //         "display_type": "number", 
  //         "trait_type": "Generation", 
  //         "value": 1
  //       }
  //     ]
  // }

  // let filez = {
  //     0: {
  //       content: JSON.stringify(content, null, 2)
  //     },
  //     1: {
  //       content: JSON.stringify(content, null, 2)
  //     }
  // }
