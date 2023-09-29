import fs from "node:fs";
import glob from "glob";
async function main() {
  try {
    const config = fs.readFileSync("./packer.config.json");

    const conf = JSON.parse(config);
    for (const e of conf.pack) {
      const stream = [];
      let tagsPromise = (async () => {
        const input = await fs.promises.readFile(e.input, "utf-8");
        const tags = {};
        let i = 0;
        input.replace(/((?:^[ \t]*))/gm, (match, indent, quot, tag, index) => {
          const prefix = input.slice(i, index);
          stream.push(prefix);
          stream.push({ indent, tags: tags[tag] || (tags[tag] = []) });
          i = index + match.length;
        });
        stream.push(input.slice(i));
        console.log(stream);
        return tags;
      })();

      const files = await new Promise((r, j) =>
        glob(e.include, {}, async (e, files) => (e ? j(e) : r(files)))
      );
      const content = files.map(async (path) => {
        try {
          const content = await fs.promises.readFile(path, "utf-8");
          const tags = await tagsPromise;
          let added = 0;
          content.replace(
            /(?:^|(?<=\n))@(\w+)[\t ]*(?:start[\t ]*\r?\n((?:(?!@\1[\t ]*end)[^\n]*\n)*)@\1[\t ]*end|\r?\n([^]*)$)/g,
            function (match, tag, body1, body2) {
              if (tag && tag in tags) {
                tags[tag].push(body1 ?? body2);
                added++;
              }
            }
          );
          if (added > 0)
            console.log(
              "Added " + added + " chunks from " + path + " to " + e.output
            );
        } catch (e) {
          if (e.code === "EISDIR") return;
          console.error(e);
        }
      });
      await Promise.all(content);
      const output = fs.createWriteStream(e.output);
      stream.forEach(function add(chunk) {
        if (typeof chunk === "string") output.write(chunk);
        else if (e.keepIndent) {
          chunk.tags.forEach((str) =>
            add(str.split("\n").join("\n" + chunk.indent))
          );
        } else chunk.tags.forEach(add);
      });
      await new Promise((r, j) => output.end((e, x) => (e ? j(e) : r(x))));
    }
  } catch (e) {
    return console.error(e);
  }
}

main();
