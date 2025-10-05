import React, { useEffect, useState } from "react";

const users = [
  "ESL_SC2",
  "OgamingSC2",
  "cretetion",
  "freecodecamp",
  "storbeck",
  "habathcx",
  "RobotCaleb",
  "noobs2ninjas"
];

export default function TwitchViewer() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const results = [];
      for (let user of users) {
        try {
          const [chanRes, streamRes] = await Promise.all([
            fetch(
              `https://twitch-proxy.freecodecamp.rocks/twitch-api/channels/${user}`
            ),
            fetch(
              `https://twitch-proxy.freecodecamp.rocks/twitch-api/streams/${user}`
            ),
          ]);

          const channelData = await chanRes.json();
          const streamData = await streamRes.json();

          results.push({
            name: user,
            logo: channelData.logo,
            url: channelData.url,
            status: streamData.stream
              ? `🟢 Online — ${streamData.stream.game}`
              : "🔴 Offline",
            description: streamData.stream
              ? streamData.stream.channel.status
              : "",
          });
        } catch (err) {
          console.error("Error fetching Twitch data:", err);
        }
      }
      setChannels(results);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">🎮 Twitch Streamers</h1>
      <div className="w-full max-w-2xl">
        {channels.map((ch) => (
          <a
            key={ch.name}
            href={ch.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 mb-4 bg-white rounded-lg shadow hover:bg-gray-50"
          >
            <img
              src={ch.logo}
              alt="logo"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h2 className="text-xl font-semibold">{ch.name}</h2>
              <p className="text-gray-600">{ch.status}</p>
              {ch.description && (
                <p className="text-sm text-gray-500 italic">{ch.description}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
