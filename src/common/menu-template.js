const { dialog } = require('electron')
function menuTemplate(window) {
    return [
        {
            label: 'View',
            submenu: [
                {
                    role: 'reload'
                },
                {
                    role: 'toggledevtools'
                }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'About',
                    click() {
                        dialog.showMessageBox({
                            type: 'info',
                            title: 'About',
                            message: `Application: Universal Clock
Author: Nam Le
Version: 1.0.0`
                        }, () => { })
                    }
                }
            ]
        }
    ]
}
module.exports = menuTemplate;