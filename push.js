import { exec } from "child_process";
const message = process.argv[2];
const branch = process.argv[3];

const command = `git add . && git commit -m "${message}" && git push origin ${branch}`;

exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
