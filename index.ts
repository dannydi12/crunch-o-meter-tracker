import { load } from "cheerio";
import { appendFileSync } from "fs";

const main = async () => {
  const data = await fetch(
    "https://members.crunch.com/netpulse/clubs/19/crunch_o_meter"
  );

  const $ = load(await data.text());
  const progressBarValue = $(".progress-bar-wrapper .progress-bar").attr(
    "style"
  );

  const progressBarRegex = /width:\s*(\d+)%/g;
  const value = progressBarRegex.exec(progressBarValue || "");

  if (!value) {
    throw new Error("No value found.");
  }

  const busyRating = value[1];

  const csvRow = `\n${busyRating},${new Date().toISOString()}`;

  appendFileSync("crowd.csv", csvRow, { encoding: "utf-8" });
};

main();
