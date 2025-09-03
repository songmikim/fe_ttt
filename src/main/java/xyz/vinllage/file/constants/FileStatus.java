package xyz.vinllage.file.constants;

public enum FileStatus {
    ALL, // 모든 파일 (완료, 미완료 구분 없이)
    DONE, // 그룹작업 완료 파일만
    UNDONE, // 그룹작업이 미완료된 파일만
    CLEAR // 미완료된 파일 중에서 삭제가 필요한 파일만
}