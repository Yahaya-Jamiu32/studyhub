/* Thin fetch wrapper. Throws { status, code, message, fields } on any failure. */
(function () {
  const cfg = window.STUDYHUB_CONFIG;
  window.StudyHubAPI = {
    isDemo: () => cfg.API_BASE === null || cfg.API_BASE === undefined,
    async post(endpointKey, payload) {
      const url = (cfg.API_BASE || "") + cfg.ENDPOINTS[endpointKey];
      let res;
      try {
        res = await fetch(url, {
          method: "POST",
          credentials: "include", // session cookie (HttpOnly) travels with the request
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.error("StudyHubAPI: request failed", url, e);
        throw { status: 0, code: "network_error", message: "We couldn't reach the server. Check your connection and try again." };
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = data.error || {};
        throw { status: res.status, code: err.code || "request_failed", message: err.message || "Something went wrong. Please try again.", fields: err.fields || {} };
      }
      return data;
    }
  };
})();
