import { useLocation } from "react-router-dom";

const useQueryFarams = () => {
  return new URLSearchParams(useLocation().search);
};

export default useQueryFarams;
