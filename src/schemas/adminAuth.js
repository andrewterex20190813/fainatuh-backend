const signin = {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        errorMessage: {
          format: "Field 'email' incorrect",
          type: "Field 'email' should be a string"
        }
      },
      password: {
        type: "string",
        errorMessage: {
          type: "Field 'password' should be a string"
        }
      }
    }
  };
  
  const signup = {
    type: "object",
    required: ["email", "name", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        errorMessage: {
          format: "Field 'email' incorrect",
          type: "Field 'email' should be a string"
        }
      },
      name: {
        type: "string",
        minLength: 2,
        maxLength: 30,
        pattern: "^[a-zA-Z0-9_ ]*$",
        errorMessage: {
          pattern: "Field 'name' can contain only letters and spaces",
          type: "Field 'name' should be a string"
        }
      },
      password: {
        type: "string",
        minLength: 8,
        errorMessage: {
          type: "Field 'password' should be a string"
        }
      }
    }
  };
  
  const forgotPassword = {
    type: "object",
    required: ["email"],
    properties: {
      email: {
        type: "string",
        format: "email",
        errorMessage: {
          format: "Field 'email' incorrect",
          type: "Field 'email' should be a string"
        }
      }
    }
  };

  const resetPassword = {
    type: "object",
    required: ["password"],
    properties: {
        password: {
            type: "string",
            minLength: 8,
            errorMessage: {
              type: "Field 'password' should be a string"
            }
        }
    }
  };


  const setPassword = {
    type: "object",
    required: ["password", "token", "id"],
    properties: {
      password: {
        type: "string",
        minLength: 8,
        errorMessage: {
          type: "Field 'password' should be a string"
        }
      },
      token: {
        type: "string",
        errorMessage: {
          type: "Field 'token' should be a string"
        }
      },
      id: {
        type: "string",
        errorMessage: {
          type: "Field 'id' should be a string"
        }
      }
    }
  };
  
  const renewPasswordToken = {
    type: "object",
    required: ["token", "id"],
    properties: {
      token: {
        type: "string",
        errorMessage: {
          type: "Field 'token' should be a string"
        }
      },
      id: {
        type: "string",
        errorMessage: {
          type: "Field 'id' should be a string"
        }
      }
    }
  }
  
  const checkPasswordTokenValidity = {
    type: "object",
    required: ["token", "id"],
    properties: {
      token: {
        type: "string",
        errorMessage: {
          type: "Field 'token' should be a string"
        }
      },
      id: {
        type: "string",
        errorMessage: {
          type: "Field 'id' should be a string"
        }
      }
    }
  }
  
  const refreshTokens = {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: {
        type: "string",
        pattern: "^(.*)::(.*)$",
        errorMessage: {
          type: "Field 'refreshToken' should be a string",
          pattern: "Incorrect format 'refreshToken'"
        }
      }
    }
  };
  
  const confirmRestorePassword = {
    type: "object",
    required: ["token", "id", "password"],
    properties: {
      token: {
        type: "string",
        errorMessage: {
          type: "Field 'token' should be a string"
        }
      },
      id: {
        type: "string",
        errorMessage: {
          type: "Field 'id' should be a string"
        }
      },
      password: {
        type: "string",
        minLength: 8,
        errorMessage: {
          type: "Field 'password' should be a string"
        }
      }
    }
  
  };
  
  const verifyRestorePasswordToken = {
    type: "object",
    required: ["token", "id"],
    properties: {
      token: {
        type: "string",
        errorMessage: {
          type: "Field 'token' should be a string"
        }
      },
      id: {
        type: "string",
        errorMessage: {
          type: "Field 'id' should be a string"
        }
      }
    }
  }
  
  export default {
    signin,
    signup,
    forgotPassword,
    resetPassword,
    setPassword,
    checkPasswordTokenValidity,
    renewPasswordToken,
    refreshTokens,
    confirmRestorePassword,
    verifyRestorePasswordToken,
  };
  