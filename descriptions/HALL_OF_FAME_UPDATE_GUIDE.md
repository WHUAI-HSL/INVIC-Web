# Hall of Fame 奖项更新说明

本网站的 Hall of Fame（模态框 Modal 2）奖项是写在静态 HTML 中的，需要手动替换。修改位置和方法如下。

## 修改位置
- 文件：`index.html`
- 位置：`<!-- Modal 2: Achievements -->` 区块内的 **Award Timeline** 部分
- 标记关键词：`Award Timeline`

## 修改方法
每一条奖项对应一个 `div.stat-card` 块。复制一条完整的 `stat-card`，然后修改以下字段：

- 年份：`<span ...>YYYY</span>`
- 赛事名称：`<h4 ...>Competition</h4>`
- 奖项等级：`<p ...>First/Second/Third Prize</p>`
- 右侧排名标识：`#1 / #2 / #3` 及颜色
- 左侧奖牌 emoji：🥇 / 🥈 / 🥉

### 奖项与样式对应关系
- First Prize：🥇，右侧 `#1`，颜色 `#fbbf24`
- Second Prize：🥈，右侧 `#2`，颜色 `#d1d5db`
- Third Prize：🥉，右侧 `#3`，颜色 `#fb923c`

## 模板示例（直接复制一条替换）
```html
<div class="stat-card">
  <div style="display: flex; align-items: flex-start; justify-content: space-between;">
    <div style="flex: 1;">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 1.875rem; margin-right: 12px;">🥇</span>
        <span style="font-size: 0.875rem; color: #2997ff; font-weight: bold;">2025</span>
      </div>
      <h4 style="font-size: 1.5rem; font-weight: bold; color: white; margin-bottom: 8px;">RoboCup China (SPL)</h4>
      <p style="color: #86868b; margin-bottom: 12px;">First Prize</p>
    </div>
    <div style="text-align: right; margin-left: 16px;">
      <div style="font-size: 2.25rem; font-weight: bold; color: #fbbf24;">#1</div>
      <div style="font-size: 0.75rem; color: #86868b;">First Prize</div>
    </div>
  </div>
</div>
```

修改完保存即可生效，无需重新生成 `config.js`。
