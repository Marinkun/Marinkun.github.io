#!/bin/bash
# ============================================================
# GeoSquad Gitee 组织初始化脚本
# 使用方法：
#   1. 先在 Gitee 生成私人令牌：https://gitee.com/profile/personal_access_tokens
#   2. 设置环境变量：export GITEE_TOKEN=你的令牌
#   3. 运行：bash scripts/gitee-setup.sh
# ============================================================

set -e

TOKEN="${GITEE_TOKEN:-}"
ORG="geosquad"
REPO="haokun.github.io"

if [ -z "$TOKEN" ]; then
    echo "❌ 错误：请先设置 GITEE_TOKEN 环境变量"
    echo "   export GITEE_TOKEN=你的Gitee私人令牌"
    exit 1
fi

echo "🚀 GeoSquad Gitee 初始化开始..."

# 1. 创建组织（如果已存在会跳过）
echo "📋 检查组织 $ORG ..."
ORG_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token $TOKEN" \
    "https://gitee.com/api/v5/orgs/$ORG")

if [ "$ORG_EXISTS" = "404" ]; then
    echo "   组织不存在，请先手动在 Gitee 创建：https://gitee.com/organizations/new"
    echo "   名称填：GeoSquad，地址填：geosquad"
    exit 1
elif [ "$ORG_EXISTS" = "401" ]; then
    echo "❌ Token 无效或已过期，请重新生成"
    exit 1
else
    echo "   ✅ 组织已存在"
fi

# 2. 在组织下创建仓库
echo "📦 创建仓库 $REPO ..."
curl -s -X POST -H "Authorization: token $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$REPO\",\"private\":false,\"description\":\"GeoSquad 极域小队博客 - AI Native 时代的人机协作探索\"}" \
    "https://gitee.com/api/v5/orgs/$ORG/repos" > /dev/null || true

echo "   ✅ 仓库创建/已存在"

# 3. 添加 Gitee 远程仓库
echo "🔗 配置 Git 远程仓库..."
cd "$(dirname "$0")/.."

if git remote | grep -q gitee; then
    git remote set-url gitee "https://${TOKEN}@gitee.com/$ORG/$REPO.git"
else
    git remote add gitee "https://${TOKEN}@gitee.com/$ORG/$REPO.git"
fi

echo "   ✅ Gitee 远程仓库已配置"

# 4. 推送到 Gitee
echo "📤 推送代码到 Gitee ..."
git push -f gitee master

echo "   ✅ 推送完成"

# 5. 开启 Gitee Pages
echo "🌐 开启 Gitee Pages ..."
curl -s -X POST -H "Authorization: token $TOKEN" \
    "https://gitee.com/api/v5/repos/$ORG/$REPO/pages/builds" > /dev/null || true

echo ""
echo "🎉 初始化完成！"
echo "   GitHub: https://github.com/Marinkun/$REPO"
echo "   Gitee:  https://gitee.com/$ORG/$REPO"
echo "   访问地址：https://$ORG.gitee.io/$REPO"
echo ""
echo "💡 提示：Gitee Pages 首次部署可能需要 1-2 分钟，请稍后访问"
