#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
团队网站自动化管理脚本
功能：
1. 自动扫描数据文件夹
2. 自动生成config.js配置文件
3. 添加成员/论文/事件/照片
4. 验证文件完整性
"""

import os
import json
from pathlib import Path
from datetime import datetime
import re

class WebsiteManager:
    def __init__(self, base_dir="."):
        self.base_dir = Path(base_dir)
        self.data_dir = self.base_dir / "data"
        self.config_file = self.base_dir / "config.js"
        
    def initialize_structure(self):
        """初始化项目文件夹结构"""
        print("📁 初始化项目结构...")
        
        directories = [
            "data/team/avatars",
            "data/team/bios",
            "data/publications",
            "data/events",
            "data/gallery",
            "assets"
        ]
        
        for dir_path in directories:
            full_path = self.base_dir / dir_path
            full_path.mkdir(parents=True, exist_ok=True)
            print(f"  ✓ 创建: {dir_path}")
        
        print("✅ 项目结构初始化完成！\n")
    
    def scan_team_members(self):
        """扫描团队成员文件"""
        print("👥 扫描团队成员...")
        members = []
        
        bios_dir = self.data_dir / "team" / "bios"
        avatars_dir = self.data_dir / "team" / "avatars"
        
        if not bios_dir.exists():
            return members
        
        for bio_file in bios_dir.glob("*.md"):
            name = bio_file.stem
            
            # 读取bio文件获取信息
            with open(bio_file, 'r', encoding='utf-8') as f:
                content = f.read()
                # 提取标题作为姓名
                title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
                display_name = title_match.group(1) if title_match else name
            
            # 查找对应的头像
            avatar_path = None
            for ext in ['.jpg', '.jpeg', '.png', '.gif']:
                avatar_file = avatars_dir / f"{name}{ext}"
                if avatar_file.exists():
                    avatar_path = f"data/team/avatars/{name}{ext}"
                    break
            
            if not avatar_path:
                avatar_path = "data/team/avatars/default.svg"
            
            member = {
                "name": display_name,
                "role": "Team Member",
                "school": "School Name",
                "avatar": avatar_path,
                "bio": f"data/team/bios/{name}.md"
            }
            members.append(member)
            print(f"  ✓ 找到成员: {display_name}")
        
        return members
    
    def scan_publications(self):
        """扫描论文文件"""
        print("📄 扫描论文...")
        publications = []
        
        pub_dir = self.data_dir / "publications"
        if not pub_dir.exists():
            return publications
        
        for pub_file in sorted(pub_dir.glob("*.md"), reverse=True):
            # 从文件名提取年份和会议
            filename = pub_file.stem
            year_match = re.search(r'(\d{4})', filename)
            venue_match = re.search(r'-([\w]+)', filename)
            
            year = year_match.group(1) if year_match else "2025"
            venue = venue_match.group(1).upper() if venue_match else "Conference"
            
            pub = {
                "file": f"data/publications/{pub_file.name}",
                "year": year,
                "venue": venue
            }
            publications.append(pub)
            print(f"  ✓ 找到论文: {filename} ({year} · {venue})")
        
        return publications
    
    def scan_events(self):
        """扫描事件文件"""
        print("📅 扫描事件...")
        events = []
        
        events_dir = self.data_dir / "events"
        if not events_dir.exists():
            return events
        
        for event_file in sorted(events_dir.glob("*.md"), reverse=True):
            # 从文件名提取日期
            filename = event_file.stem
            date_match = re.search(r'(\d{4})-(\d{2})', filename)
            
            if date_match:
                year, month = date_match.groups()
                month_names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                date_str = f"{month_names[int(month)]} {year}"
            else:
                date_str = "Recent"
            
            # 第一个事件设为高亮
            is_first = len(events) == 0
            
            event = {
                "file": f"data/events/{event_file.name}",
                "date": date_str,
                "highlight": is_first
            }
            events.append(event)
            print(f"  ✓ 找到事件: {filename} ({date_str})")
        
        return events
    
    def scan_gallery(self):
        """扫描照片"""
        print("🖼️  扫描照片...")
        images = []
        
        gallery_dir = self.data_dir / "gallery"
        if not gallery_dir.exists():
            return images
        
        image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        
        for img_file in sorted(gallery_dir.glob("*")):
            if img_file.suffix.lower() in image_extensions:
                # 从文件名生成标题
                caption = img_file.stem.replace('-', ' ').replace('_', ' ').title()
                
                image = {
                    "src": f"data/gallery/{img_file.name}",
                    "caption": caption
                }
                images.append(image)
                print(f"  ✓ 找到照片: {img_file.name}")
        
        return images
    
    def generate_config(self):
        """自动生成config.js配置文件"""
        print("\n🔧 生成配置文件...\n")
        
        # 扫描所有内容
        members = self.scan_team_members()
        publications = self.scan_publications()
        events = self.scan_events()
        images = self.scan_gallery()
        
        # 生成配置对象
        config = {
            "team": {
                "members": members
            },
            "publications": publications,
            "events": events,
            "gallery": {
                "images": images,
                "autoScan": False,
                "scanFolder": "data/gallery/"
            }
        }
        
        # 生成JavaScript代码
        js_content = f"""// 网站内容配置文件
// 自动生成于: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
// 使用 python website_manager.py generate 重新生成此文件

const siteConfig = {json.dumps(config, indent=4, ensure_ascii=False)};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = siteConfig;
}}
"""
        
        # 写入文件
        with open(self.config_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"\n✅ 配置文件已生成: {self.config_file}")
        print(f"  - 团队成员: {len(members)}")
        print(f"  - 论文数量: {len(publications)}")
        print(f"  - 事件数量: {len(events)}")
        print(f"  - 照片数量: {len(images)}")
    
    def add_member(self, name, role, school):
        """交互式添加团队成员"""
        print(f"\n➕ 添加新成员: {name}")
        
        # 创建bio文件
        bio_file = self.data_dir / "team" / "bios" / f"{name.lower().replace(' ', '-')}.md"
        
        bio_content = f"""# {name}

## 研究方向
- 方向1
- 方向2

## 教育背景
- {school}

## 技能
- 技能1
- 技能2

## 个人简介
请在这里添加个人简介...
"""
        
        with open(bio_file, 'w', encoding='utf-8') as f:
            f.write(bio_content)
        
        print(f"  ✓ 创建简介文件: {bio_file}")
        print(f"  ⚠️  请上传头像到: data/team/avatars/{name.lower().replace(' ', '-')}.jpg")
        print(f"  ⚠️  请编辑简介文件: {bio_file}")
    
    def add_publication(self, title, year, venue):
        """添加新论文"""
        print(f"\n➕ 添加新论文: {title}")
        
        filename = f"{year}-{venue.lower()}-{title.lower().replace(' ', '-')[:30]}.md"
        pub_file = self.data_dir / "publications" / filename
        
        pub_content = f"""# {title}

**Authors:** 作者1, 作者2

**Venue:** {venue} {year}

**Abstract:**
请在这里添加论文摘要...

## 主要贡献
1. 贡献1
2. 贡献2

## 结果
请描述实验结果...

## 代码和数据
- GitHub: [链接]
- Paper PDF: [链接]

## 引用
```bibtex
@inproceedings{{...}}
```
"""
        
        with open(pub_file, 'w', encoding='utf-8') as f:
            f.write(pub_content)
        
        print(f"  ✓ 创建论文文件: {pub_file}")
        print(f"  ⚠️  请编辑论文内容: {pub_file}")
    
    def add_event(self, title, date):
        """添加新事件"""
        print(f"\n➕ 添加新事件: {title}")
        
        # 解析日期
        date_obj = datetime.strptime(date, "%Y-%m")
        filename = f"{date_obj.strftime('%Y-%m')}-{title.lower().replace(' ', '-')[:30]}.md"
        event_file = self.data_dir / "events" / filename
        
        event_content = f"""# {title}

事件描述...

## 亮点
- 亮点1
- 亮点2

## 详细信息
请添加详细信息...

## 媒体报道
- [链接1](url)
"""
        
        with open(event_file, 'w', encoding='utf-8') as f:
            f.write(event_content)
        
        print(f"  ✓ 创建事件文件: {event_file}")
        print(f"  ⚠️  请编辑事件内容: {event_file}")
    
    def validate(self):
        """验证项目完整性"""
        print("\n🔍 验证项目完整性...\n")
        
        issues = []
        
        # 检查必要的文件
        required_files = ["index.html", "content-loader.js"]
        for file in required_files:
            if not (self.base_dir / file).exists():
                issues.append(f"❌ 缺少文件: {file}")
        
        # 检查数据文件夹
        if not self.data_dir.exists():
            issues.append("❌ 缺少data文件夹")
        
        # 检查team成员的头像
        bios_dir = self.data_dir / "team" / "bios"
        avatars_dir = self.data_dir / "team" / "avatars"
        
        if bios_dir.exists():
            for bio_file in bios_dir.glob("*.md"):
                name = bio_file.stem
                has_avatar = False
                for ext in ['.jpg', '.jpeg', '.png']:
                    if (avatars_dir / f"{name}{ext}").exists():
                        has_avatar = True
                        break
                if not has_avatar:
                    issues.append(f"⚠️  成员 {name} 缺少头像")
        
        if issues:
            print("发现以下问题：")
            for issue in issues:
                print(f"  {issue}")
        else:
            print("✅ 所有检查通过！")
        
        return len(issues) == 0
    
    def interactive_menu(self):
        """交互式菜单"""
        while True:
            print("\n" + "="*50)
            print("🌐 团队网站管理工具")
            print("="*50)
            print("\n请选择操作：")
            print("1. 初始化项目结构")
            print("2. 自动生成配置文件 (config.js)")
            print("3. 添加团队成员")
            print("4. 添加论文")
            print("5. 添加事件")
            print("6. 验证项目完整性")
            print("0. 退出")
            
            choice = input("\n请输入选项 (0-6): ").strip()
            
            if choice == "1":
                self.initialize_structure()
            elif choice == "2":
                self.generate_config()
            elif choice == "3":
                name = input("姓名: ").strip()
                role = input("角色: ").strip()
                school = input("学院: ").strip()
                self.add_member(name, role, school)
                print("\n提示: 添加完成后，运行选项2重新生成配置文件")
            elif choice == "4":
                title = input("论文标题: ").strip()
                year = input("年份: ").strip()
                venue = input("会议名称: ").strip()
                self.add_publication(title, year, venue)
                print("\n提示: 添加完成后，运行选项2重新生成配置文件")
            elif choice == "5":
                title = input("事件标题: ").strip()
                date = input("日期 (格式: 2025-12): ").strip()
                self.add_event(title, date)
                print("\n提示: 添加完成后，运行选项2重新生成配置文件")
            elif choice == "6":
                self.validate()
            elif choice == "0":
                print("\n👋 再见！")
                break
            else:
                print("\n❌ 无效选项，请重新选择")
            
            input("\n按回车键继续...")

def main():
    import sys
    
    manager = WebsiteManager()
    
    # 如果没有参数，显示交互式菜单
    if len(sys.argv) == 1:
        manager.interactive_menu()
    else:
        # 命令行模式
        command = sys.argv[1]
        
        if command == "init":
            manager.initialize_structure()
        elif command == "generate" or command == "gen":
            manager.generate_config()
        elif command == "validate" or command == "check":
            manager.validate()
        else:
            print("用法:")
            print("  python website_manager.py              # 交互式菜单")
            print("  python website_manager.py init         # 初始化项目结构")
            print("  python website_manager.py generate     # 生成配置文件")
            print("  python website_manager.py validate     # 验证项目")

if __name__ == "__main__":
    main()
