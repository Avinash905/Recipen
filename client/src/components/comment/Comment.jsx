import P from "prop-types";
import React from "react";
import { BsCalendarCheck } from "react-icons/bs";
import { IconButton, Menu, MenuItem, Avatar as MuiAvatar } from "@mui/material";
import dateFormat from "../../common/dateFormat";
import { MoreVert } from "@mui/icons-material";

const Comment = ({ comment, userId, handleDeleteComment }) => {
  const formattedDate = dateFormat(comment?.date);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuId = React.useId();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    setAnchorEl(null);
    handleDeleteComment(comment?._id);
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl flex flex-col sm:flex-row gap-4 p-6 items-center">
      {/* Commented user details */}
      <MuiAvatar
        alt={comment?.user?.name}
        src={comment?.user?.profilePicture}
        sx={{ width: 60, height: 60 }}
        className="border-2 border-primary shadow-lg"
      />
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between flex-col sm:flex-row items-center">
          <h4 className="font-bold text-lg">{comment?.user?.name}</h4>
          <span className="flex gap-2 items-center text-sm">
            <BsCalendarCheck />
            {formattedDate}
          </span>
        </div>
        {/* Comment content */}
        <div className="flex justify-between">
          <p>{comment?.comment}</p>
          {comment?.user?._id === userId && (
            <>
              <IconButton
                aria-label="Comment actions"
                id={`${menuId}-button`}
                aria-controls={open ? `${menuId}-menu` : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                size="small"
                onClick={handleClick}
              >
                <MoreVert />
              </IconButton>
              <Menu
                id={`${menuId}-menu`}
                MenuListProps={{
                  "aria-labelledby": `${menuId}-button`,
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

Comment.propTypes = { userId: P.string, handleDeleteComment: P.func, comment: P.shape({ _id: P.string, date: P.string, comment: P.string, user: P.shape({ _id: P.string, name: P.string, profilePicture: P.string }) }).isRequired };

export default Comment;
