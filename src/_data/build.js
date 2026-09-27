// The git branch this build came from (Netlify sets BRANCH), so links to
// docs in the repo match the deployed code — a deploy preview links to its
// PR branch, where a new doc already exists, instead of main.
module.exports = {
  branch: process.env.BRANCH || "main",
};
