# Clean Code Audit
1. Find all files > 400 lines: `find src -name '*.ts' -o -name '*.tsx' | xargs wc -l | sort -rn | awk '$1>400'`
2. List each with line count and primary responsibility.
3. Propose split plan (modules under 400 lines).
4. After refactor, run `npm run typecheck` and `npm run lint`.
5. Commit each file's refactor separately.
