var $builtinmodule = function() {
  /* NOTE: The maximum number of audio contexts is 6 and it looks like everytime a program is 
   * run it executes this file again, so, we need this check to protect against repeated
   * context creation.
   */
  if(!window.__$audioContext$__) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.__$audioContext$__ = new AudioContext();
  }
  return {};
};
