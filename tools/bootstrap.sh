#! /bin/sh

# プロジェクトのルートディレクトリに移動
FILE_PATH=$(dirname "$0")
cd "$FILE_PATH/../" || exit

# ANSIエスケープシーケンスによる色の定義
# https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
GREEN=$(printf '\033[32m')
RED=$(printf '\033[31m')
GRAY=$(printf '\033[90m')
BLUE=$(printf '\033[34m')
RESET=$(printf '\033[0m')

# 色付きの記号定義
# [✓] 成功
# [✗] エラー
# >>> 実行中
CHECK_MARK="${GREEN}[✓]${RESET}"
ERROR_MARK="${RED}[✗]${RESET}"
ROCKET="${BLUE}>>>${RESET}"

printf "%s Bootstrap start\n" "${ROCKET}"
printf "%s Working directory: %s\n" "${ROCKET}" "$(pwd)"

# エラー発生を追跡するフラグ
HAS_ERROR=0

##############################################################################
##
##  Git コミットテンプレートの設定
##  - コミットメッセージのテンプレートを設定
##  - プロジェクトの一貫性のあるコミットメッセージを維持
##
##############################################################################
printf "\n%s Git commit message: Start\n" "${ROCKET}"
if command -v git >/dev/null 2>&1; then
  if git config commit.template commit-template; then
    printf "%s Git commit message: git config commit.template is %s/%s\n" "${CHECK_MARK}" "$(pwd)" "$(git config commit.template)"
    printf "%s Git commit message: Success\n" "${CHECK_MARK}"
  else
    printf "%s Git commit message: Failed to configure template\n" "${ERROR_MARK}"
    HAS_ERROR=1
  fi
else
  printf "%s Git is not installed\n" "${ERROR_MARK}"
  printf "    %s Please install Git using one of the following methods:\n" "${ERROR_MARK}"
  printf "    %s • Official guide: https://git-scm.com/downloads\n" "${GRAY}"
  printf "    %s • Using Homebrew: brew install git\n" "${GRAY}"
  HAS_ERROR=1
fi

##############################################################################
##
##  mise のインストール
##  - .mise.toml に定義された環境をインストール
##  - bun などの開発ツールをインストール
##
##############################################################################
printf "\n%s mise install: Start\n" "${ROCKET}"
if command -v mise >/dev/null 2>&1; then
  if mise install; then
    printf "%s mise install: Success\n" "${CHECK_MARK}"
  else
    printf "%s mise install: Failed\n" "${ERROR_MARK}"
    printf "    %s Please check the error message above and try again\n" "${GRAY}"
    printf "    %s If the issue persists, see: https://mise.jdx.dev/getting-started.html\n" "${GRAY}"
    HAS_ERROR=1
  fi
else
  printf "%s mise is not installed\n" "${ERROR_MARK}"
  printf "    %s Please install mise using one of the following methods:\n" "${ERROR_MARK}"
  printf "    %s • Official guide: https://mise.jdx.dev/getting-started.html\n" "${GRAY}"
  printf "    %s • Using Homebrew: brew install mise\n" "${GRAY}"
  printf "    %s • Using curl: curl https://mise.jdx.dev/install.sh | sh\n" "${GRAY}"
  HAS_ERROR=1
fi

##############################################################################
##
##  bun のセットアップ
##  - プロジェクトの依存関係をインストール
##  - package.json に定義されたパッケージを管理
##
##############################################################################
printf "\n%s bun install: Start\n" "${ROCKET}"
if command -v bun >/dev/null 2>&1; then
  if bun install; then
    printf "%s bun install: Success\n" "${CHECK_MARK}"
  else
    printf "%s bun install: Failed\n" "${ERROR_MARK}"
    printf "    %s Please check the error message above and try again\n" "${GRAY}"
    printf "    %s If the issue persists, run 'bun install --verbose' for more details\n" "${GRAY}"
    HAS_ERROR=1
  fi
else
  printf "%s bun is not installed\n" "${ERROR_MARK}"
  if command -v mise >/dev/null 2>&1; then
    printf "    %s Please install bun using mise:\n" "${ERROR_MARK}"
    printf "    %s Run 'mise install' to install bun from .mise.toml\n" "${GRAY}"
  else
    printf "    %s Please install mise first, then run 'mise install' to install bun\n" "${ERROR_MARK}"
    printf "    %s See mise installation instructions above\n" "${GRAY}"
  fi
  HAS_ERROR=1
fi

##############################################################################
##
##  lefthook のセットアップ
##  - Gitフックの設定
##  - コミット前のチェックやフォーマットを自動化
##
##############################################################################
printf "\n%s lefthook install: Start\n" "${ROCKET}"
if command -v lefthook >/dev/null 2>&1; then
  if lefthook install; then
    printf "%s lefthook install: Success\n" "${CHECK_MARK}"
  else
    printf "%s lefthook install: Failed\n" "${ERROR_MARK}"
    printf "    %s Please check if Git is properly initialized in this repository\n" "${GRAY}"
    printf "    %s Run 'git init' if this is a new repository\n" "${GRAY}"
    HAS_ERROR=1
  fi
else
  printf "%s lefthook is not installed\n" "${ERROR_MARK}"
  if command -v bun >/dev/null 2>&1; then
    printf "    %s Please install lefthook using bun:\n" "${ERROR_MARK}"
    printf "    %s Run 'bun i' to install project dependencies including lefthook\n" "${GRAY}"
  else
    printf "    %s Please install bun first, then run 'bun i' to install lefthook\n" "${ERROR_MARK}"
    printf "    %s See bun installation instructions above\n" "${GRAY}"
  fi
  HAS_ERROR=1
fi

##############################################################################
##
##  セットアップ完了
##
##############################################################################
if [ "$HAS_ERROR" -eq 0 ]; then
  printf "\n%s Bootstrap finished successfully\n" "${CHECK_MARK}"
  exit 0
else
  printf "\n%s Bootstrap finished with errors\n" "${ERROR_MARK}"
  printf "%s Please fix the issues above and run 'make bs' again\n" "${GRAY}"
  exit 1
fi
