module.exports = async function fetchSCPStatus() {
  try {
    const players = Math.floor(Math.random() * 10);
    const maxPlayers = 20;
    return {
      name: `🟢 SCP - ${players}/${maxPlayers}`
    };
  } catch (e) {
    return {
      name: `🔴 SCP - Offline`
    };
  }
}