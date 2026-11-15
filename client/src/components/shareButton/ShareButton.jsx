import P from "prop-types";
import { useState } from "react";
import { AiOutlineShareAlt } from "react-icons/ai";
import { FiLink } from "react-icons/fi";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { Menu, MenuItem } from "@mui/material";
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from "react-share";

const ShareButton = ({ url, type = "recipe" }) => {
  const [anchor, setAnchor] = useState(null);
  const [message, setMessage] = useState("");
  const close = () => setAnchor(null);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link copied.");
    } catch {
      setMessage("Could not copy the link. Copy it from your browser address bar.");
    }
    close();
  };
  return <div>
    <button type="button" aria-label={`Share ${type}`} aria-haspopup="menu" aria-expanded={Boolean(anchor)} onClick={(event) => { setMessage(""); setAnchor(event.currentTarget); }} className="rounded p-1 text-2xl text-[#775421] focus:outline focus:outline-2 focus:outline-[#775421]"><AiOutlineShareAlt aria-hidden="true" /></button>
    <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close} slotProps={{ paper: { sx: { minWidth: 210, border: "1px solid #e8e1d7", borderRadius: "16px", boxShadow: "0 12px 35px rgba(41, 37, 31, .14)", mt: 1, "& .MuiMenuItem-root": { display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "11px 16px !important", color: "#433b32", fontSize: "0.9rem", textAlign: "left" }, "& .MuiMenuItem-root:hover": { backgroundColor: "#f8f3eb" } } } }}>
      <MenuItem onClick={copy}><FiLink aria-hidden="true" /> Copy link</MenuItem>
      <MenuItem component={FacebookShareButton} url={url} onClick={close} aria-label="Share on Facebook"><FaFacebookF aria-hidden="true" /> Share on Facebook</MenuItem>
      <MenuItem component={TwitterShareButton} url={url} onClick={close} aria-label="Share on X"><FaTwitter aria-hidden="true" /> Share on X</MenuItem>
      <MenuItem component={LinkedinShareButton} url={url} onClick={close} aria-label="Share on LinkedIn"><FaLinkedinIn aria-hidden="true" /> Share on LinkedIn</MenuItem>
    </Menu>
    {message && <span className="block max-w-xs text-xs text-[#62584b]" role="status">{message}</span>}
  </div>;
};
ShareButton.propTypes = { url: P.string.isRequired, type: P.string };

export default ShareButton;
