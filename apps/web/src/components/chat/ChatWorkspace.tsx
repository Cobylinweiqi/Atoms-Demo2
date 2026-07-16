import React from 'react';

interface ChatWorkspaceProps {
  children: React.ReactNode;
}

/**
 * ChatWorkspace - AI Chat Workspace 主容器
 * 三栏布局：Project List | Chat | Preview
 *
 * 设计系统参考：
 * - 背景：bg-base (#07070B)
 * - 边框：border-default (rgba(255,255,255,0.06))
 * - 玻璃效果：glass-light
 */
export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#07070B]">
      {children}
    </div>
  );
};

/**
 * ChatWorkspaceColumn - 工作区列容器
 * 用于包裹每个列（左侧、中间、右侧）
 */
interface ChatWorkspaceColumnProps {
  children: React.ReactNode;
  className?: string;
  width?: 'auto' | 'fixed-280' | 'fixed-320' | 'fixed-400';
}

export const ChatWorkspaceColumn: React.FC<ChatWorkspaceColumnProps> = ({
  children,
  className = '',
  width = 'auto',
}) => {
  const widthClasses = {
    auto: '',
    'fixed-280': 'w-[280px]',
    'fixed-320': 'w-[320px]',
    'fixed-400': 'w-[400px]',
  };

  return (
    <div
      className={`
        flex flex-col h-full
        border-r border-[rgba(255,255,255,0.06)]
        ${widthClasses[width]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

/**
 * ChatWorkspaceColumn - 不带右边框的列（用于最右侧）
 */
export const ChatWorkspaceColumnLast: React.FC<ChatWorkspaceColumnProps> = ({
  children,
  className = '',
  width = 'auto',
}) => {
  const widthClasses = {
    auto: '',
    'fixed-280': 'w-[280px]',
    'fixed-320': 'w-[320px]',
    'fixed-400': 'w-[400px]',
  };

  return (
    <div
      className={`
        flex flex-col h-full flex-1
        ${widthClasses[width]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

/**
 * ChatWorkspaceHeader - 列头部
 */
interface ChatWorkspaceHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ChatWorkspaceHeader: React.FC<ChatWorkspaceHeaderProps> = ({
  children,
  className = '',
}) => {
  return (
    <header
      className={`
        flex items-center gap-3 px-4 py-3
        border-b border-[rgba(255,255,255,0.06)]
        bg-[rgba(11,11,18,0.50)]
        backdrop-blur-[12px]
        ${className}
      `}
    >
      {children}
    </header>
  );
};

/**
 * ChatWorkspaceContent - 列内容区域
 */
interface ChatWorkspaceContentProps {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

export const ChatWorkspaceContent: React.FC<ChatWorkspaceContentProps> = ({
  children,
  className = '',
  scrollable = true,
}) => {
  return (
    <div
      className={`
        flex-1 overflow-hidden
        ${scrollable ? 'overflow-y-auto' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};