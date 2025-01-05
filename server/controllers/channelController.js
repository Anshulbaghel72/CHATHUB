const mongoose = require("mongoose");
const Channel = mongoose.model("Channel");

exports.createChannel = async (req, res) => {
  const { name } = req.body;

  const nameRegex = /^[A-Za-z\s]+$/;

  if (!nameRegex.test(name)) throw "Channel name can contain only alphabets.";
  const channelExists = await Channel.findOne({ name });

  if (channelExists) throw "Channel with that name already exists!";

  const channel = new Channel({
    name,
  });

  await channel.save();

  res.json({
    message: "Channel created!",
  });
};

exports.getChannelSentiment = async (req, res) => {
  const channel = await Channel.findOne({
    _id: req.params.id,
  });

  if (!channel) throw "This channel does not exists!";

  res.json({
    totalSentimentScore: channel.totalSentimentScore,
    totalMessages: channel.totalMessages,
    positive: channel.positive,
    neutral: channel.neutral,
    negative: channel.negative,
  });
};

exports.getAllChannels = async (req, res) => {
  const channels = await Channel.find({});

  res.json(channels);
};


exports.deleteChannel = async (req, res) => {
  const { id } = req.params;

  try {
    const channel = await Channel.findById(id);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    await Channel.findByIdAndDelete(id);

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error) {
    console.error("Error deleting channel:", error);
    res.status(500).json({ message: "An error occurred while deleting the channel" });
  }
};


exports.updateChannelSentiment = async (req, res) => { 
  const { sentimentScore } = req.body;
  const channel = await Channel.findOne({
    _id: req.params.id,
  });

  if (!channel) throw "This channel does not exists!";

  channel.totalSentimentScore += sentimentScore;
  channel.totalMessages += 1;

  if (sentimentScore > 0) {
    channel.positive += 1;
  } else if (sentimentScore === 0) {
    channel.neutral += 1;
  } else {
    channel.negative += 1;
  }

  await channel.save();

  res.json({
    message: "Channel sentiment updated!",
  });
}
