package xyz.vinllage.file.services;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import xyz.vinllage.file.constants.FileStatus;
import xyz.vinllage.file.entities.FileInfo;
import xyz.vinllage.file.repositories.FileInfoRepository;
import xyz.vinllage.global.exceptions.UnAuthorizedException;
import xyz.vinllage.member.entities.Member;
import xyz.vinllage.member.libs.MemberUtil;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileDeleteService {
    private final FileInfoService infoService;
    private final FileInfoRepository repository;
    private final MemberUtil memberUtil;

    /**
     * 파일 등록번호로 삭제 처리
     *
     * @param seq
     * @return 삭제된 파일 정보
     */
    public FileInfo process(Long seq) {
        FileInfo item = infoService.get(seq);

        // 파일 삭제 권한 체크 S
        String createdBy = item.getCreatedBy();
        Member member = memberUtil.getMember(); // 로그인 사용자 정보
        if (!memberUtil.isAdmin() && memberUtil.isLogin() && StringUtils.hasText(createdBy) && !createdBy.equals(member.getEmail())) {
            // 회원이 올린 파일인 경우 로그인 사용자의 이메일과 일치하는지 체크하고 일치하지 않으면 UnAuthorizedException을 발생, 단, 관리자는 모두 가능
            throw new UnAuthorizedException();
        }

        // 파일 삭제 권한 체크 E

        // 파일 삭제
        File file = new File(item.getFilePath());
        if (file.exists()) {
            file.delete();
        }

        // DB 기록을 삭제
        repository.delete(item);
        repository.flush();

        return item;
    }

    /**
     * 파일 목록 삭제
     *
     * @param gid
     * @param location
     * @return
     */
    public List<FileInfo> process(String gid, String location) {
        List<FileInfo> items = infoService.getList(gid, location, FileStatus.ALL);
        List<FileInfo> deletedItems = new ArrayList<>();
        for (FileInfo item : items) {
            try {
                process(item.getSeq());
                deletedItems.add(item); // 삭제된 파일 정보
            } catch (Exception e) {}
        }

        return deletedItems;
    }

    public List<FileInfo> process(String gid) {
        return process(gid, null);
    }

    /**
     * 매일 자정마다 하루전 미완료된 파일 일괄 삭제
     */
    @Scheduled(cron="0 0 0 * * *")
    public void clearUnDone() {
        // 미완료된 파일 목록 조회(하루전)
        List<FileInfo> clearItems = infoService.getList(null, null, FileStatus.CLEAR);
        List<FileInfo> undoneItems = infoService.getList(null, null, FileStatus.UNDONE);

        List<FileInfo> items = new ArrayList<>();
        items.addAll(clearItems);
        items.addAll(undoneItems);

        items.forEach(item -> {
            // 실 파일 삭제
            String path = item.getFilePath();
            File file = new File(path);
            if (file.exists()) {
                file.delete();
            }
        });

        repository.deleteAll(items);
        repository.flush();
    }
}