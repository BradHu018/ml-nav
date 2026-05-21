const db = require("../config/db");

async function saveBuild(req, res) {
    try {
        const userId = req.user.id;
        const buildId = req.params.id;

        const [buildRows] = await db.query(
            `
            SELECT id, user_id, is_public
            FROM saved_builds
            WHERE id = ?
            `,
            [buildId]
        );

        if (buildRows.length == 0) {
            return res.status(404).json({
                message: "Build not found",
            });
        }

        const build = buildRows[0];

        if (!build.is_public) {
            return res.status(403).json({
                message: "You cannot save a private build",
            });
        }

        if (Number(build.user_id) === Number(userId)) {
            return res.status(403).json({
                message: "You cannot save your own build",
            });
        }

        await db.query( 
            `
            INSERT INTO build_favorites (user_id, build_id)
            VALUES (?, ?)
            `,
            [userId, buildId]
        );

        return res.status(201).json({
            message: "Build saved successfully",
        })
    } catch (error) {
        console.error("Save build error: ", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "You already saved this build",
            })
        }

        return res.status(500).json({
            message: "Internal server error while saving build",
        });
    }
}

async function unsaveBuild(req, res) {
    try {
        const userId = req.user.id;
        const buildId = req.params.id;

        const [result] = await db.query(
            `
            DELETE FROM build_favorites
            WHERE user_id = ? AND build_id = ?
            `,
            [userId, buildId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Saved build not found",
            });
        }

        return res.status(200).json({
            message: "Build removed from saved builds",
        });
        } catch (error) {
            console.error("Unsave build error:", error);

            return res.status(500).json({
                message: "Internal server error while removing saved build",
            });
        }
}

async function getSavedBuilds(req, res) {
    try {
        const userId = req.user.id;

        const [rows] = await db.query(
            `
            SELECT 
                sb.id,
                sb.user_id,
                u.username,
                sb.hero_name,
                sb.build_name,
                sb.description,
                sb.emblem,
                sb.battle_spell,
                sb.upvotes,
                sb.downvotes,
                sb.is_public,
                sb.created_at,
                bf.created_at AS saved_at,
                GROUP_CONCAT(bi.item_name ORDER BY bi.item_order SEPARATOR ',') AS build_items
            FROM build_favorites bf
            JOIN saved_builds sb ON bf.build_id = sb.id
            JOIN users u ON sb.user_id = u.id
            LEFT JOIN build_items bi ON sb.id = bi.build_id
            WHERE bf.user_id = ?
                AND sb.is_public = TRUE
            GROUP BY sb.id, bf.created_at
            ORDER BY bf.created_at DESC
            `,
            [userId]
        );
        const builds = rows.map((build) => ({
            ...build,
            build_items: build.build_items ? build.build_items.split(",") : [],
            is_saved: true,
        }));

        return res.status(200).json({
            builds,
        });

        } catch (error) {
            console.error("Get saved builds error:", error);

            return res.status(500).json({
            message: "Internal server error while getting saved builds",
        });
    }
}

module.exports = {
    saveBuild,
    unsaveBuild,
    getSavedBuilds,
};