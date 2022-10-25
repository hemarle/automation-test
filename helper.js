export let sportyBet = {
  basketball: {
    "over 2.5": "over 2.5",
    " Winner (incl. overtime)": "",
  },
};

export let converter = {
  basket: {
    "Winner (incl. overtime)": {
      msport: { game: "Winner (incl. overtime)", home: 0, away: 1 },
    },
    "Handicap (incl. overtime)": { msport: "Handicap (incl. overtime)" },
    "Over/Under (incl. overtime)": { msport: "O/U (incl. overtime)" },
    "Over/Under": { msport: "O/U" },
    "1st Half - Over/Under": { msport: "1st half -O/U" },
    "2nd Half - Over/Under": { msport: "2nd half - O/U" },
  },
};
