import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Icon } from "@material-ui/core";
import NewChannel from "./NewChannel";
import { DELETE } from "../utils/api";
import makeToast from "./Toaster";


const ChannelsList = ({ channels, socket }) => {
  const [allChannels, setAllChannels] = useState(channels);

  useEffect(() => {
    setAllChannels(channels);
  }, [channels]);

  const [dropdownVisible, setDropdownVisible] = useState();
  const [editingChannel, setEditingChannel] = useState();
  const [newChannelName, setNewChannelName] = useState("");

  const handleToggleDropdown = (channelId) => {
    setDropdownVisible(dropdownVisible === channelId ? null : channelId);
  };

  const handleEditChannel = (channelId, currentName) => {
    setEditingChannel(channelId);
    setNewChannelName(currentName);
    setDropdownVisible(null);
  };
 
  const deleteChannel = (channelId) => {
    DELETE(
      `channel/${channelId}`, 
      {},
      {
        Authorization: "Bearer " + localStorage.getItem("CC_Token"),
      },
      (response) => {
        makeToast("success", response.data.message);
        if (socket) {
          socket.emit("deleteChannel", { channelId });
        }
        setAllChannels(allChannels.filter(channel => channel._id !== channelId));
      },
      (err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      }
    );
  };
  


  const handleSaveChannelName = (channelId) => {
    const updatedChannels = allChannels.map(channel => 
      channel._id === channelId ? { ...channel, name: newChannelName } : channel
    );
    setAllChannels(updatedChannels);
    setEditingChannel(null);
  };

  return (
    <div className="channelsListOuterContainer">
      <div>
        <h1 className="channelsListHeading">Channels</h1>
        {allChannels ? (
          <List>
            {allChannels.map((channel, i) => (
              <div key={i} className="channelWrapper">
                <Link to={"/channel/" + channel._id}>
                  <ListItem button className="channel">
                    <div className="channelInfo">
                      {editingChannel === channel._id ? (
                        <input
                          type="text"
                          value={newChannelName}
                          onChange={(e) => setNewChannelName(e.target.value)}
                          className="channelNameInput"
                          outline="none"
                        />
                      ) : (
                        channel.name
                      )}
                    </div>
                  </ListItem>
                </Link>
                <Icon
                  className="fa fa-ellipsis-h channelIcon"
                  onClick={() => handleToggleDropdown(channel._id)}
                  style={{ cursor: "pointer", fontSize: "16px" }}
                />
                {dropdownVisible === channel._id && (
                  <div className="dropdownMenu">
                    <div onClick={() => handleEditChannel(channel._id, channel.name)}>
                      Edit
                    </div>
                    <div onClick={() => deleteChannel(channel._id, channel.name)}>
                      Delete
                    </div>
                  </div>
                )}
                {editingChannel === channel._id && (
                  <button onClick={() => handleSaveChannelName(channel._id)} className="saveButton">
                    Save
                  </button>
                )}
              </div>
            ))}
          </List>
        ) : null}
      </div>
      <NewChannel socket={socket} />
    </div>
  );
};

export default ChannelsList;
