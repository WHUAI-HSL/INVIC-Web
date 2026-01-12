// 网站内容配置文件
// 自动生成于: 2026-01-12 18:15:21
// 使用 python website_manager.py generate 重新生成此文件

const siteConfig = {
    "team": {
        "members": [
            {
                "name": "张三",
                "role": "Team Member",
                "school": "School Name",
                "avatar": "data/team/avatars/default.jpg",
                "bio": "data/team/bios/zhangsan.md"
            }
        ]
    },
    "publications": [
        {
            "file": "data/publications/2025-cvpr-slam.md",
            "year": "2025",
            "venue": "CVPR"
        }
    ],
    "events": [
        {
            "file": "data/events/2025-12-robocup.md",
            "date": "Dec 2025",
            "highlight": true
        }
    ],
    "gallery": {
        "images": [],
        "autoScan": false,
        "scanFolder": "data/gallery/"
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = siteConfig;
}
