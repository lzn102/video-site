// 安装必要的依赖
// npm install fluent-ffmpeg

import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

/**
 * 从视频文件中提取音频
 * @param {string} videoPath - 视频文件路径
 * @param {string} outputPath - 输出音频文件路径
 * @returns {Promise<string>} 音频文件路径
 */
export const extractAudioFromVideo = (videoPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions('-vn') // 禁用视频输出
      .outputOptions('-ar', '44100') // 音频采样率
      .outputOptions('-ac', '2') // 音频通道数
      .outputOptions('-ab', '192k') // 音频比特率
      .outputOptions('-f', 'mp3') // 输出格式
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject(err);
      })
      .save(outputPath);
  });
};

/**
 * 合并视频和音频文件
 * @param {string} videoPath - 视频文件路径
 * @param {string} audioPath - 音频文件路径
 * @param {string} outputPath - 输出视频文件路径
 * @returns {Promise<string>} 合并后的视频文件路径
 */
export const mergeVideoAndAudio = (videoPath, audioPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .input(audioPath)
      .outputOptions('-c:v', 'copy') // 复制视频流
      .outputOptions('-c:a', 'aac') // 音频编码为 AAC
      .outputOptions('-strict', 'experimental')
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject(err);
      })
      .save(outputPath);
  });
};

/**
 * 获取视频信息
 * @param {string} videoPath - 视频文件路径
 * @returns {Promise<object>} 视频信息
 */
export const getVideoInfo = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
};