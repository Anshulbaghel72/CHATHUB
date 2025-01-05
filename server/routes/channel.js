const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandler");
const channelController = require("../controllers/channelController");

const auth = require("../middlewares/auth");

router.get("/", auth, catchErrors(channelController.getAllChannels));
router.get(
  "/:id/sentiment",
  auth,
  catchErrors(channelController.getChannelSentiment)
);
router.post("/", auth, catchErrors(channelController.createChannel));
router.delete("/:id", auth, catchErrors(channelController.deleteChannel));
router.put(
  "/:id/sentiment",
  auth,
  catchErrors(channelController.updateChannelSentiment)
);

module.exports = router;
