export const LoginInitialState = {
  fullPageLoading: true,
  login: false,
  signup: false,
  commentSubmit: false
};

export const LoginSignUpReducer = (state, action) => {
  switch (action.type) {
    case "SIGNUP":
      return { ...state, signup: action.payload };
    case "LOGIN":
      return {
        ...state,
        login: action.payload,
      };
    case "LOADER":
      return {
        ...state,
        fullPageLoading: action.payload
      }
    case "COMMENT_SUBMIT":
      return {
        ...state,
        commentSubmit: action.payload
      }
    default:
      state;
  }
};
