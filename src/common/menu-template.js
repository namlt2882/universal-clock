const menuTemplate = [
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Set default time zone'
            },
            {
                label: 'Add more time zone'
            }
        ]
    },

    {
        label: 'View',
        submenu: [
            {
                role: 'reload'
            },
            {
                role: 'toggledevtools'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'About'
            }
        ]
    }
]
module.exports = menuTemplate;