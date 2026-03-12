-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LiveSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT,
    "subjectId" TEXT,
    "teacherId" TEXT NOT NULL,
    "roomCode" TEXT NOT NULL,
    "topic" TEXT,
    "subtopic" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "isApprovalRequired" BOOLEAN NOT NULL DEFAULT false,
    "youtubeLiveVideoId" TEXT,
    "youtubeRecordingId" TEXT,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LiveSession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LiveSession_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LiveSession_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LiveSession" ("courseId", "createdAt", "endedAt", "id", "isApprovalRequired", "roomCode", "startedAt", "status", "subjectId", "subtopic", "teacherId", "topic", "updatedAt", "youtubeLiveVideoId", "youtubeRecordingId") SELECT "courseId", "createdAt", "endedAt", "id", "isApprovalRequired", "roomCode", "startedAt", "status", "subjectId", "subtopic", "teacherId", "topic", "updatedAt", "youtubeLiveVideoId", "youtubeRecordingId" FROM "LiveSession";
DROP TABLE "LiveSession";
ALTER TABLE "new_LiveSession" RENAME TO "LiveSession";
CREATE UNIQUE INDEX "LiveSession_roomCode_key" ON "LiveSession"("roomCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
