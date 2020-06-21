const fs = require('fs');

const regex = '[0-9]|.mp3|Kbps| {2,}|\\.|\\-';

/*
* getFileName from url/path
* remove numbers, extension unwanted spaces from file.
* */

// prettier-ignore
const fileName = (url) => (
    url.substring(url.lastIndexOf('/') + 1).
    replace(new RegExp(regex, 'g'), ''))
    .trim();

/*
* getFiles from the Directory,
* @param dir string , ex: E:\\ directory
* @param files default empty = []
* */
const getFiles = (dir, files_ = []) => {
    const files = fs.readdirSync(dir);
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const i in files) {
        const path = `${dir}/${files[i]}`;
        if (fs.statSync(path).isDirectory()) {
            getFiles(path, files_);
        } else if (path.includes('.mp3')) {
            files_.push({
                track: files_.length + 1,
                name: fileName(path).trim(),
                path,
                duration: '0',
            });
        }
    }
    return files_;
};

module.exports = {
    fileName,
    getFiles,
};
