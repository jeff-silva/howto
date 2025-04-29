const humanize = {
  timeAgo() {},

  timeDuration(totalSeconds, opts = {}) {
    const decades = Math.floor(totalSeconds / (60 * 60 * 24 * 365.25 * 10));
    const years = Math.floor(totalSeconds / (60 * 60 * 24 * 365.25)) % 10;
    const days = Math.floor(totalSeconds / (60 * 60 * 24)) % 365;
    const hours = Math.floor(totalSeconds / (60 * 60)) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds % 60);

    const parts = [];

    if (decades > 0) {
      parts.push(`${decades} decade${decades !== 1 ? "s" : ""}`);
    }

    if (years > 0) {
      parts.push(`${years} year${years !== 1 ? "s" : ""}`);
    }

    if (days > 0) {
      parts.push(`${days} day${days !== 1 ? "s" : ""}`);
    }

    if (hours > 0) {
      parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    }

    if (minutes > 0 || decades > 0 || years > 0 || days > 0 || hours > 0) {
      parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    }

    if (
      seconds >= 0 ||
      (decades === 0 &&
        years === 0 &&
        days === 0 &&
        hours === 0 &&
        minutes === 0)
    ) {
      parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);
    }

    return parts.join(", ").trim();
  },

  bytes() {},

  distance() {},
};
