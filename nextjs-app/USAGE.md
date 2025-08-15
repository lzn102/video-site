# 多媒体处理工具使用说明

这是一个基于 Next.js 构建的多媒体处理工具，提供以下功能：

## 功能介绍

### 1. 视频语音提取
- 从上传的视频文件中提取音频
- 支持常见的视频格式（MP4, AVI, MOV等）
- 输出为 MP3 格式的音频文件

### 2. 语音转字幕
- 将音频文件转换为带时间戳的字幕文件
- 支持常见的音频格式（MP3, WAV, AAC等）
- 输出为 SRT 格式的字幕文件

### 3. 字幕翻译
- 将字幕文件翻译为其他语言
- 支持多种语言互译
- 输出为翻译后的 SRT 格式字幕文件

### 4. 视频音频合并
- 将视频文件和音频文件合并为新视频
- 保持原视频质量
- 输出为 MP4 格式的视频文件

## 安装和运行

1. 安装依赖：
   ```bash
   npm install
   ```

2. 安装 FFmpeg：
   - Windows: 下载 FFmpeg 并添加到系统路径
   - macOS: `brew install ffmpeg`
   - Linux: `sudo apt-get install ffmpeg`

3. 运行开发服务器：
   ```bash
   npm run dev
   ```

4. 在浏览器中访问 `http://localhost:3000`

## API 接口

所有功能都通过以下 API 接口实现：

- `POST /api/extract-audio` - 视频语音提取
- `POST /api/speech-to-subtitle` - 语音转字幕
- `POST /api/translate-subtitle` - 字幕翻译
- `POST /api/merge-video-audio` - 视频音频合并

## 注意事项

1. 为了实现完整的语音识别和翻译功能，需要集成第三方服务：
   - 语音识别：阿里云智能语音交互、百度语音识别等
   - 翻译服务：阿里云机器翻译、百度翻译等

2. 当前实现使用了示例代码，实际使用时需要替换为真实的 API 调用。

3. 文件上传大小限制取决于服务器配置。

4. 处理大文件时可能需要较长时间，请耐心等待。