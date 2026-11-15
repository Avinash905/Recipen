import P from "prop-types";
import React from "react";
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
    <div className="flex items-start gap-4 rounded-2xl border border-[#e8e1d7] bg-white p-5 sm:p-6">
      {/* Commented user details */}
      <MuiAvatar
        alt={comment?.user?.name}
        src={comment?.user?.profilePicture}
        sx={{ width: 44, height: 44, bgcolor: "#e9dfd0", color: "#62584b", flexShrink: 0 }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3"><div><h4 className="break-words font-semibold text-[#29251f]">{comment?.user?.name || "Recipen community"}</h4><p className="mt-1 text-xs text-[#6b6257]">{formattedDate}</p></div>
        {/* Comment content */}
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
        <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-[#433b32]">{comment?.comment}</p>
      </div>
    </div>
  );
};

Comment.propTypes = { userId: P.string, handleDeleteComment: P.func, comment: P.shape({ _id: P.string, date: P.string, comment: P.string, user: P.shape({ _id: P.string, name: P.string, profilePicture: P.string }) }).isRequired };

export default Comment;
