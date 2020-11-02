require("dotenv").config();

const GITHUB_GIST_KEY = process.env.GITHUB_GIST_KEY

const CONTRACT_IDENTIFIER = ".nft-minter"; // add a . in the beginning to make it appear first on the gist list
const temp_metadata_dir = './temp_metadata';
const contracturi_file = '../metadata/contracturi.json';

const GIST_CHECKOUT_CMD = 'git clone https://gist.github.com/'

const fs = require('fs');
const rfs = require('recursive-fs');
const shell = require('shelljs');

const { Octokit } = require("@octokit/core");

const octokit = new Octokit({ auth: GITHUB_GIST_KEY });

let imageData = {}
let contractUri = {}
let gistId;

const main = async () => {
  
  // upload the contract URI first so we have a gist id
  await createContractUri();
  
  console.log("Contract URI saved: " + gistId);

  // check out the gist repository
  await checkoutGist();

  // copy all files into the repo
  await copyFilesToRepo();

  // commit the source to github
  await commitGistRepo();

  // await getImageData();
  // saveImageData();

}

const commitGistRepo = async () => {
  shell.cd(temp_metadata_dir + "/" + gistId);
  shell.exec("git add .");
  shell.exec("git commit -m 'add metadata'");
  shell.exec('git push');
}

const copyFilesToRepo = async () => {

  const definitions_dir = './metadata/definitions';
  
  const gist_dir = temp_metadata_dir + "/" + gistId;

  let {files} = await rfs.read(definitions_dir);

  files.forEach( async (file) => {
    let filename = file.split("/").pop();

    fs.copyFileSync(file, gist_dir + "/" + filename);

  })
}

const checkoutGist = async () => {
  shell.cd(temp_metadata_dir);
  shell.exec(GIST_CHECKOUT_CMD + gistId + ".git")
  shell.cd("..");

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

const saveImageData = async () => {

  const response = await octokit.request("POST /gists", {
    files: imageData
    });

}

const getImageData = async () => {

  const images_dir = './metadata/images';

  let {files} = await rfs.read(images_dir);

  files.forEach( async (file) => {
    let filename = file.split("/").pop();

    const data = fs.readFileSync(file);
    
    imageData[filename] = 
    {
      content: data
    }

  })


  // recursive.readdirr(images_dir, function (err, dirs, imageFiles) {
  //   imageFiles.forEach((file) => {
  //         imageCount++;
  //         let filename = file.split("/").pop();

  //         const data = fs.readFile(file);
  //         imageData[filename] = data.toString();

  //         console.log(data)
  //     })
  //   })


  const content =
  {
    "id": "0",
    "name": "Fighter Sword",
    "description": "For poking.",
    "image": "Fighter_Sword.png",
    "attributes": [
        {
          "trait_type": "Base", 
          "value": "Sword"
        }, 
        {
          "trait_type": "Attack", 
          "value": 10
        }, 
        {
          "trait_type": "Speed", 
          "value": 0.5
        }, 
        {
          "display_type": "boost_number", 
          "trait_type": "Enchantment", 
          "value": 40
        }, 
        {
          "display_type": "boost_percentage", 
          "trait_type": "Chance to Hit", 
          "value": 50
        }, 
        {
          "display_type": "number", 
          "trait_type": "Generation", 
          "value": 1
        }
      ]
  }

  let filez = {
      0: {
        content: JSON.stringify(content, null, 2)
      },
      1: {
        content: JSON.stringify(content, null, 2)
      }
  }
}

main()