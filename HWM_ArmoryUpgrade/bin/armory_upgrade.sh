#find HWM_ArmoryUpgrade/framework/src -name "*.js" > usr/input
vendor/mergejs/mergejs HWM_ArmoryUpgrade/bin/armory_upgrade/input usr/output
sed -i "s/export class/class/g" usr/output
sed -i "s/'use strict';//g" usr/output
# shellcheck disable=SC2002
{ cat HWM_ArmoryUpgrade/framework/src/UserScriptHeader.js & cat usr/output; } | grep -v "^import" | grep -v "^    //console.log" > usr/output.user.js
