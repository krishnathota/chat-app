export const globals = {userId: undefined, config: {serviceURL: undefined}};
let ophubAPI;
try {
    ophubAPI = eval('EMBED');
    // globals.config.serviceURL = 'http://ironman-dev.htclab.ge.com:3002/';
    globals.config.serviceURL =
        ophubAPI.getComponent().fieldsDescription.serviceURL;
} catch {
    globals.config.serviceURL = 'http://localhost:3001';
}
